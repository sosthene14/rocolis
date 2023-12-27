import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function Selector({ data, selected, setSelected }) {
  const [query, setQuery] = useState("");
  function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  const filteredPeople =
    query === ""
      ? data
      : data.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="">
      <Combobox value={selected || ""} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative bg-slate-200 shadow-md w-60 sm:w-72 cursor-default overflow-hidden rounded-lg  sm:text-sm focus:ring-blue-500 focus:border-blue-500 block focus:border-2">
            <Combobox.Input
            required
              className="w-60 outline-none border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-500 focus:ring-0"
              displayValue={(person) => person.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex  pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400 hover:text-gray-500 "
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options key={generateRandomString(10)} aria-required className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-500" key={data.id}>
                  Aucun resultat
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <Combobox.Option
                  aria-required
                  key={generateRandomString(10)}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "z-10 bg-violet-hover text-white " : "text-gray-500"
                      }`
                    }
                    value={person || ""}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex pl-3 ${
                              active ? "text-white z-10" : "bg-violet-active text-white"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default Selector;