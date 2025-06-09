import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  Text,
  HStack,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChatIcon, CloseIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; // Placeholder bot avatar

const Chatbot = ({ providerId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! Ask me anything about this provider, their services, or policies.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const greenBg = useColorModeValue("green.100", "green.500");
  const greenAccent = useColorModeValue("green.500", "green.100");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      if (!providerId) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: "Provider ID is missing. Please select a provider.",
          },
        ]);
        setLoading(false);
        return;
      }
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text, providerId }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.answer || "Sorry, no answer received.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, something went wrong with the chatbot.",
        },
      ]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      <Box position="fixed" bottom={8} right={8} zIndex={1200}>
        <IconButton
          icon={<ChatIcon />}
          colorScheme="green"
          size="lg"
          borderRadius="full"
          boxShadow="lg"
          aria-label="Open Chatbot"
          onClick={onOpen}
        />
      </Box>
      {/* Chat Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent borderRadius="xl" overflow="hidden">
          <ModalHeader bg={greenBg} color={greenAccent} display="flex" alignItems="center" justifyContent="space-between">
            <HStack justifyContent="space-between" w="100%">
              <HStack>
                <Avatar size="sm" src={BOT_AVATAR} />
                <Text fontWeight="bold">Provider Assistant</Text>
              </HStack>
              <IconButton size="sm" icon={<CloseIcon />} onClick={onClose} aria-label="Close" />
            </HStack>
          </ModalHeader>
          <ModalBody p={0} bg={useColorModeValue("white", "gray.900")}>  
            <VStack align="stretch" spacing={3} maxH="350px" overflowY="auto" px={4} py={2}>
              {messages.map((msg, idx) => (
                <HStack
                  key={idx}
                  alignSelf={msg.from === "user" ? "flex-end" : "flex-start"}
                  spacing={2}
                >
                  {msg.from === "bot" && <Avatar size="xs" src={BOT_AVATAR} />}
                  <Box
                    bg={msg.from === "user" ? greenAccent : greenBg}
                    color={msg.from === "user" ? "white" : "green.900"}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    maxW="80%"
                  >
                    <Text fontSize="sm">{msg.text}</Text>
                  </Box>
                  {msg.from === "user" && <Avatar size="xs" name="You" />}
                </HStack>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
          </ModalBody>
          <ModalFooter bg={greenBg}>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) handleSend();
                }}
                isDisabled={loading}
                bg={useColorModeValue("white", "gray.800")}
              />
              <InputRightElement width="3rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  icon={<ArrowForwardIcon />}
                  onClick={handleSend}
                  isLoading={loading}
                  colorScheme="green"
                  aria-label="Send"
                  isDisabled={loading || !input.trim()}
                />
              </InputRightElement>
            </InputGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Chatbot;
