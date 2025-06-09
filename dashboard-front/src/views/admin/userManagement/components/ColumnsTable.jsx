// Import Chakra UI components and icons:
import React, { useState, useEffect } from 'react';
import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { MdArchive } from 'react-icons/md';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { archiveSupermarket, archiveDemander, updateSupermarket, updateDemander } from 'services/adminService';

const columnHelper = createColumnHelper();

export default function ColumnTable(props) {
  const { tableData, columnsData, title, onDataUpdate } = props;
  const [sorting, setSorting] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useToast();

  // Chakra modal disclosure for the modify/edit modal:
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  // Build your columns from passed in columnsData:
  const columns = columnsData.map((col) =>
    columnHelper.accessor(col.accessorKey, {
      id: col.accessorKey,
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          {col.header}
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {col.cell ? col.cell(info) : info.getValue()}
        </Text>
      ),
    })
  );

  // Add an extra "Actions" column:
  const actionsColumn = columnHelper.display({
    id: "actions",
    header: () => (
      // Center the header text
      <Text textAlign="center">
        Actions
      </Text>
    ),
    cell: ({ row }) => (
      <Flex
        justify="flex-start"
        align="center"
        minW="100px"
        whiteSpace="nowrap" >
        <IconButton
          icon={<EditIcon />}
          size="md"
          mr={2}
          onClick={() => {
            setSelectedRow(row.original);
            onOpen();
          }}
          aria-label="Modify"
        />
        <IconButton
          icon={<MdArchive />}
          size="md"
          colorScheme="teal"
          onClick={() => handleArchive(row.original)}
          aria-label="Archive"
        />
      </Flex>
    ),
  });

  // Combine the columns arrays
  const allColumns = [...columns, actionsColumn];

  const table = useReactTable({
    data: tableData,
    columns: allColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleArchive = async (rowData) => {
    try {
      if (title === "Supermarkets") {
        await archiveSupermarket(rowData._id);
        const updatedList = tableData.filter((item) => item._id !== rowData._id);
        onDataUpdate(updatedList);
        toast({
          title: "Supermarket archived",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (title === "Demanders") {
        await archiveDemander(rowData._id);
        const updatedList = tableData.filter((item) => item._id !== rowData._id);
        onDataUpdate(updatedList);
        toast({
          title: "Demander archived",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(`Error archiving ${title.toLowerCase()}:`, error);
      toast({
        title: "Error",
        description: `Failed to archive ${title.toLowerCase()}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // For the modify modal, a simple form with prefilled data:
  const [formData, setFormData] = useState({});

  // When selectedRow changes, prefill the form
  useEffect(() => {
    if (selectedRow) {
      setFormData(selectedRow);
    }
  }, [selectedRow]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      if (title === "Supermarkets") {
        await updateSupermarket(formData._id, formData);
        const updatedList = tableData.map((item) =>
          item._id === formData._id ? { ...item, ...formData } : item
        );
        onDataUpdate(updatedList);
        toast({
          title: "Supermarket updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (title === "Demanders") {
        await updateDemander(formData._id, formData);
        const updatedList = tableData.map((item) =>
          item._id === formData._id ? { ...item, ...formData } : item
        );
        onDataUpdate(updatedList);
        toast({
          title: "Demander updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      console.error(`Error updating ${title.toLowerCase()}:`, error);
      toast({
        title: "Error",
        description: `Failed to update ${title.toLowerCase()}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Card flexDirection="column" w="100%" px="0px" overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
          <Text color={textColor} fontSize="22px" mb="4px" fontWeight="700" lineHeight="100%">
            {title}
          </Text>
          <Menu />
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple" color="gray.500" mb="24px" mt="12px" minW="100%">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                      whiteSpace="nowrap"
                    >
                      <Flex justifyContent="space-between" align="center" fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: "↑",
                          desc: "↓",
                        }[header.column.getIsSorted()] ?? null}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id} fontSize={{ sm: "14px" }} minW={{ sm: "150px", md: "200px", lg: "auto" }} borderColor="transparent" whiteSpace="nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* Modify Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          bg={useColorModeValue("white", "brand.500")}
          borderRadius="20px"
          p="20px"
        >
          <ModalHeader
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Modify Record
          </ModalHeader>
          <ModalCloseButton color={textColor} />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Name
              </FormLabel>
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
                borderRadius="16px"
                borderColor={borderColor}
                _focus={{ borderColor: "brand.500" }}
                color={textColor}
              />
            </FormControl>
            {formData.business_type !== undefined && (
              <FormControl mb={4}>
                <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                  Business Type
                </FormLabel>
                <Input
                  name="business_type"
                  value={formData.business_type || ""}
                  onChange={handleFormChange}
                  borderRadius="16px"
                  borderColor={borderColor}
                  _focus={{ borderColor: "brand.500" }}
                  color={textColor}
                />
              </FormControl>
            )}
            <FormControl mb={4}>
              <FormLabel color={textColor} fontSize="sm" fontWeight="700">
                Location
              </FormLabel>
              <Input
                name="location"
                value={formData.location || ""}
                onChange={handleFormChange}
                borderRadius="16px"
                borderColor={borderColor}
                _focus={{ borderColor: "brand.500" }}
                color={textColor}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="brand"
              mr={3}
              onClick={handleFormSubmit}
              borderRadius="16px"
              px="24px"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              borderRadius="16px"
              px="24px"
              color={textColor}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
