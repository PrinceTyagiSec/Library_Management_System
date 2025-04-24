import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import React from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

type FilterSectionProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  searchBy: string;
  setSearchBy: React.Dispatch<React.SetStateAction<string>>;
  entityType: string;
  returnStatus?: string;
  setReturnStatus?: React.Dispatch<React.SetStateAction<string>>;
  accountStatus?: string;
  setAccountStatus?: React.Dispatch<React.SetStateAction<string>>;
};

const FilterSection: React.FC<FilterSectionProps> = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  searchBy,
  setSearchBy,
  returnStatus,
  setReturnStatus,
  accountStatus,
  setAccountStatus,
  entityType,
}) => {

  const getSearchPlaceholder = () => {
    if (entityType === "book") return "Search Books...";
    if (entityType === "bookStatus") return "Search Books...";
    if (entityType === "user") return "Search Users...";
    if (entityType === "borrowHistory") return "Search Borrowers...";
    return "Search...";
  };

  const getFilterOptions = () => {
    if (entityType === "borrowHistory") {
      return [
        { value: "All", label: "All" },
        { value: "returned", label: "Returned" },
        { value: "not_returned", label: "Not Returned" },
        { value: "overdue", label: "Overdue" },
      ];
    }
    if (entityType === "userBorrowHistory") {
      return [
        { value: "All", label: "All" },
        { value: "returned", label: "Returned" },
        { value: "not_returned", label: "Not Returned" },
        { value: "overdue", label: "Overdue" },
      ];
    }
    if (entityType === "bookStatus") {
      return [
        { value: "all_books", label: "All" },
        { value: "available", label: "Available" },
        { value: "not_available", label: "Not Available" },

      ];
    }

    if (entityType === "book") {
      return [
        { value: "all", label: "All" },
        { value: "deleted", label: "Removed" },
        { value: "not_deleted", label: "In Library" },
      ];
    }
    return [];
  };

  const getAccountStatusOptions = () => [
    { value: "All", label: "All" },
    { value: "active", label: "Active Account" },
    { value: "deleted", label: "Deleted Account" },
  ];

  const getSearchOptions = () => {
    if (entityType === "book") {
      return [
        { value: "title", label: "Search by Title" },
        { value: "author", label: "Search by Author" },
      ];
    }
    else if (entityType === "bookStatus") {
      return [
        { value: "title", label: "Search by Title" },
        { value: "author", label: "Search by Author" },
      ];
    }
    else if (entityType === "userBorrowHistory") {
      return [
        { value: "book", label: "Search by Title" },
        { value: "author", label: "Search by Author" },
      ];
    }

    else if (entityType === "user") {
      return [
        { value: "name", label: "Search by Name" },
        { value: "email", label: "Search by Email" },
      ];
    } else if (entityType === "borrowHistory") {
      return [
        { value: "book", label: "Search by Title" },
        { value: "author", label: "Search by Author" },
        { value: "borrower", label: "Search by Name" },
        { value: "borrowerEmail", label: "Search by Email" },
      ];
    }
    return [];
  };

  const getUserFilterOptions = () => {
    if (entityType === "user") {
      return [
        { value: "All", label: "All" },
        { value: "verified", label: "Verified User" },
        { value: "not_verified", label: "Not Verified User" },
      ];
    }
    return [];
  };

  return (
    <motion.div
      className={`flex flex-wrap items-center gap-4 w-full ${entityType === 'bookStatus' ? 'justify-center' : ''
        }`}
    >

      <motion.div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          className="pl-10 pr-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200 w-full sm:w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>
      {(entityType === "book" || entityType === "user" || entityType === "bookStatus") && (
        <div className="relative w-48 ">
          <Listbox value={filterStatus} onChange={setFilterStatus}>
            {({ open }) => (
              <>
                <Listbox.Button className="w-full flex justify-between items-center px-4 py-2 bg-gray-700 text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <span>
                    {
                      (entityType === "user" ? getUserFilterOptions() : getFilterOptions()).find(opt => opt.value === filterStatus)?.label
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Listbox.Button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      className="absolute mt-1 w-full rounded-lg bg-gray-800 shadow-lg z-10 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Listbox.Options static>
                        {(entityType === "user" ? getUserFilterOptions() : getFilterOptions()).map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) =>
                              `cursor-pointer px-4 py-2 ${active ? 'bg-blue-600 text-white' : 'text-gray-300'
                              }`
                            }
                          >
                            {option.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </Listbox>
        </div>
      )}
      {entityType === "borrowHistory" && accountStatus && setAccountStatus && (
        <div className="relative w-48">
          <Listbox value={accountStatus} onChange={setAccountStatus}>
            {({ open }) => (
              <>
                <Listbox.Button className="w-full flex justify-between items-center px-4 py-2 bg-gray-700 text-white rounded-lg">
                  <span>
                    {
                      getAccountStatusOptions().find(opt => opt.value === accountStatus)?.label
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Listbox.Button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      className="absolute mt-1 w-full rounded-lg bg-gray-800 shadow-lg z-10 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Listbox.Options static>
                        {getAccountStatusOptions().map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) =>
                              `cursor-pointer px-4 py-2 ${active ? 'bg-blue-600 text-white' : 'text-gray-300'}`
                            }
                          >
                            {option.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </Listbox>
        </div>
      )}


      {(entityType === "borrowHistory" || entityType === "userBorrowHistory") && returnStatus && setReturnStatus && (
        <div className="relative w-48">
          <Listbox value={returnStatus} onChange={setReturnStatus}>
            {({ open }) => (
              <>
                <Listbox.Button className="w-full flex justify-between items-center px-4 py-2 bg-gray-700 text-white rounded-lg">
                  <span>
                    {
                      getFilterOptions().find(opt => opt.value === returnStatus)?.label
                    }
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Listbox.Button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      className="absolute mt-1 w-full rounded-lg bg-gray-800 shadow-lg z-10 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Listbox.Options static>
                        {getFilterOptions().map((option) => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) =>
                              `cursor-pointer px-4 py-2 ${active ? 'bg-blue-600 text-white' : 'text-gray-300'}`
                            }
                          >
                            {option.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </Listbox>
        </div>
      )}


      {/* Filter by search type */}
      <div className="relative w-48">
        <Listbox value={searchBy} onChange={setSearchBy}>
          {({ open }) => (
            <>
              <Listbox.Button className="w-full flex justify-between items-center px-4 py-2 bg-gray-700 text-white rounded-lg">
                <span>
                  {
                    getSearchOptions().find(opt => opt.value === searchBy)?.label
                  }
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Listbox.Button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    className="absolute mt-1 w-full rounded-lg bg-gray-800 shadow-lg z-10 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Listbox.Options static>
                      {getSearchOptions().map((option) => (
                        <Listbox.Option
                          key={option.value}
                          value={option.value}
                          className={({ active }) =>
                            `cursor-pointer px-4 py-2 ${active ? 'bg-blue-600 text-white' : 'text-gray-300'}`
                          }
                        >
                          {option.label}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </Listbox>
      </div>

    </motion.div>
  );
};

export default FilterSection;
