import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuChevronDown } from "react-icons/lu";
import clsx from 'clsx';
import { useState } from 'react';

function ComboBox({
  items = [],
  onChange,
  value,
  placeholder = '',
  displayKey = 'option',
  ariaLabel = 'Select an option'
}) {
  const [query, setQuery] = useState('');
  const [defaultItem] = (Array.isArray(items) ? items : []).filter(i => String(i.value) === String(value)) || [null];
  const [selectedItem, setSelectedItem] = useState(defaultItem ? defaultItem : null);

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) =>
          item[displayKey]?.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox 
      value={selectedItem} 
      onChange={(item) => { setSelectedItem(item); onChange(item); }} 
      onClose={() => setQuery('')}
    >
      <div className="relative">
        <ComboboxInput
          className={clsx(
            'w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
          aria-label={ariaLabel}
          displayValue={(item) => item?.[displayKey] || ''}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <LuChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        anchor="bottom"
        transition
        className={clsx(
          'w-[var(--input-width)] rounded-xl border border-white/5 bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
        )}
      >
        {filteredItems.map((item) => (
          <ComboboxOption
            key={item.value}
            value={item}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
          >
            <IoCheckmarkOutline className="invisible size-4 fill-white group-data-[selected]:visible" />
            <div className="text-sm/6 text-black">{item[displayKey]}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}

export default ComboBox;
