import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuChevronDown } from "react-icons/lu";
import clsx from 'clsx';
import { useState } from 'react';

function ComboBox({ medicine, onChange, placeholder = '' }) {

  const [query, setQuery] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const filteredMedicine =
  query === ''
    ? medicine
    : medicine.filter((medicineItem) =>
      medicineItem.name.toLowerCase().includes(query.toLowerCase())
    );

  return (

    <Combobox value={selectedMedicine} onChange={(med) => { setSelectedMedicine(med); onChange(med); }} onClose={() => setQuery('')}>

      <div className="relative">
        <ComboboxInput
          className={clsx(
            'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}
          aria-label="Select Medicine"
          displayValue={(med) => med?.name || ''}
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
        {filteredMedicine.map((medicineItem) => (
          <ComboboxOption
            key={medicineItem.id} 
            value={medicineItem}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
          >
          <IoCheckmarkOutline className="invisible size-4 fill-white group-data-[selected]:visible" />
            <div className="text-sm/6 text-black">{medicineItem.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>

    </Combobox>
  )
}

export default ComboBox;