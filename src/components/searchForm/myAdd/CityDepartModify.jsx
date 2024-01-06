import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import cities from "cities.json";

export default function CityDepartModify({ citieValue,defaultValue }) {
  const [selected, setSelected] = useState(defaultValue);
  const [query, setQuery] = useState("");

  useEffect(() => {
    citieValue(selected);
  }, [selected]);

  const getFilteredPeople = () => {
    const uniqueCityNames = new Set();
    const filteredResults = [];

    if (query === "") {
      cities.slice(0, 100).forEach((citie) => {
        if (!uniqueCityNames.has(citie.name.toLowerCase())) {
          uniqueCityNames.add(citie.name.toLowerCase());
          filteredResults.push(citie);
        }
      });
    } else {
      cities
        .filter((citie) =>
          citie.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )
        .forEach((citie) => {
          if (!uniqueCityNames.has(citie.name.toLowerCase())) {
            uniqueCityNames.add(citie.name.toLowerCase());
            filteredResults.push(citie);
          }
        });
    }

    return filteredResults.slice(0, 10);
  };

  const filteredPeople = getFilteredPeople();

  return (
    <div className="fixed top-16 w-72">
      <Combobox value={selected || ""} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              required
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(citie) => citie.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
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
            <Combobox.Options
              aria-required
              className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Aucun résultat.
                </div>
              ) : (
                filteredPeople.map((citie) => (
                  <Combobox.Option
                    key={citie.lat}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={citie}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {citie.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
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
