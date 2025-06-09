import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Image,
  Tooltip,
  Flex,
  Box,
  IconButton,
  useClipboard
} from "@chakra-ui/react";
import { MdDelete, MdOpenInNew, MdFileDownload, MdContentCopy } from "react-icons/md";

// Helper to highlight best/worst values
const getHighlight = (values, value, type = "min") => {
  if (!Array.isArray(values) || values.length === 0) return false;
  if (type === "min") return value === Math.min(...values);
  if (type === "max") return value === Math.max(...values);
  return false;
};

// Export as CSV
function exportToCSV(products) {
  if (!products.length) return;
  const headers = Object.keys(products[0]);
  const rows = products.map(p => headers.map(h => JSON.stringify(p[h] ?? "")).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product-comparison.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProductComparisonModal({ isOpen, onClose, products, onRemove }) {
  const { onCopy, hasCopied, value } = useClipboard(
    window.location.href + "#compare=" + products.map(p => p.id || p._id).join(",")
  );

  if (!products || products.length < 2) return null;

  // Attributes to show (add more as needed)
  const attributes = [
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "price_per_unit", label: "Price/Unit", highlight: "min" },
    { key: "quantity", label: "Quantity", highlight: "max" },
    { key: "unit", label: "Unit" },
    { key: "expiration_date", label: "Expiration Date" },
    { key: "production_date", label: "Production Date" },
    { key: "origin_country", label: "Origin Country" },
    { key: "supplier_id", label: "Supplier ID" },
    { key: "viewCount", label: "Views" },
    { key: "description", label: "Description" }
  ];

  // For highlights
  const getValues = key => products.map(p => Number(p[key]) || 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Compare Products</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex justify="flex-end" mb={4} gap={2}>
            <Button leftIcon={<MdFileDownload />} onClick={() => exportToCSV(products)}>
              Export CSV
            </Button>
            <Tooltip label={hasCopied ? "Copied!" : "Copy Link"} closeOnClick={false}>
              <Button leftIcon={<MdContentCopy />} onClick={onCopy}>
                Copy Link
              </Button>
            </Tooltip>
          </Flex>
          <Box overflowX="auto">
            <Table variant="striped" size="md">
              <Thead>
                <Tr>
                  <Th>Attribute</Th>
                  {products.map(p => (
                    <Th key={p.id || p._id} textAlign="center">
                      <Flex direction="column" align="center">
                        <Box>{p.name}</Box>
                        <IconButton
                          icon={<MdDelete />}
                          size="xs"
                          colorScheme="red"
                          aria-label="Remove product"
                          onClick={() => onRemove(p.id || p._id)}
                          mt={1}
                        />
                        <IconButton
                          icon={<MdOpenInNew />}
                          size="xs"
                          colorScheme="brand"
                          aria-label="View details"
                          as="a"
                          href={`#/product/${p.id || p._id}`}
                          target="_blank"
                          mt={1}
                        />
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {attributes.map(attr => (
                  <Tr key={attr.key}>
                    <Td fontWeight="bold">{attr.label}</Td>
                    {products.map((p, idx) => {
                      let content = p[attr.key];
                      // Special handling for images
                      if (attr.key === "image" && p.image) {
                        content = <Image src={p.image} boxSize="60px" objectFit="cover" alt={p.name} />;
                      }
                      // Highlight best/worst
                      let highlight = false;
                      if (attr.highlight) {
                        highlight = getHighlight(getValues(attr.key), Number(p[attr.key]), attr.highlight);
                      }
                      return (
                        <Td
                          key={p.id || p._id}
                          textAlign="center"
                          bg={highlight ? (attr.highlight === "min" ? "green.100" : "blue.100") : undefined}
                        >
                          {content || "-"}
                        </Td>
                      );
                    })}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
