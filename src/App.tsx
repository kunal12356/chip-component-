import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import './style.css';

interface Chip {
  id: number;
  label: string;
}

export const App: React.FC<{ name: string }> = ({ name }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(true);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig'];

  const getFilteredOptions = () => {
    return items.filter(
      (item) =>
        !selectedItems.includes(item) &&
        item.toLowerCase().startsWith(inputValue.toLowerCase())
    );
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setHighlightedIndex(-1);
    // setShowDropdown(true);
  };

  const handleItemSelect = (item: string) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
    setInputValue('');
    // setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleItemRemove = (item: string) => {
    const updatedItems = selectedItems.filter(
      (selectedItem) => selectedItem !== item
    );
    setSelectedItems(updatedItems);
  };

  const handleInputBlur = () => {
    // setShowDropdown(true);
    // setTimeout(() => setShowDropdown(true), 100);
  };

  const handleInputFocus = () => {
    console.log('handleInputFocus');
    // setShowDropdown();
  };

  const handleItemClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      // setShowDropdown(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && showDropdown) {
      setHighlightedIndex((prevIndex) => {
        const filteredOptions = getFilteredOptions();
        return prevIndex < filteredOptions.length - 1
          ? prevIndex + 1
          : prevIndex;
      });
    } else if (event.key === 'ArrowUp' && showDropdown) {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (
      event.key === 'Enter' &&
      showDropdown &&
      highlightedIndex !== -1
    ) {
      const filteredOptions = getFilteredOptions();
      handleItemSelect(filteredOptions[highlightedIndex]);
    }
  };

  const handleItemMouseDown = (event: MouseEvent, item: string) => {
    event.preventDefault();
    handleItemSelect(item);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleItemClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleItemClickOutside);
    };
  }, []);

  useEffect(() => {
    if (inputValue === '') {
      setHighlightedIndex(-1);
    }
  }, [inputValue]);

  const placeholderText = 'Type here...';

  // let placeholderText = (
  //   <div className="selected-items">
  //     {selectedItems.map((item, index) => (
  //       <div key={index} className="selected-item">
  //         {/* {selectedItems[index]} */}
  //         conso.log({selectedItems[index]});
  //         {/* <button onClick={() => handleItemRemove(item)}>X</button> */}
  //       </div>
  //     ))}
  //     Type here...
  //   </div>
  // );

  console.log(placeholderText);

  return (
    <div className="custom-input-container">
      <div className="selected-items">
        {selectedItems.map((item, index) => (
          <div key={item} className="selected-item">
            {item}
            <button onClick={() => handleItemRemove(item)}>X</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholderText}
        className="custom-input"
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />

      {showDropdown && (
        <div className="item-list" ref={dropdownRef}>
          {getFilteredOptions().map((item, index) => (
            <div
              key={item}
              className={`item ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => handleItemSelect(item)}
              onMouseDown={(event) => handleItemMouseDown(event, item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* {showDropdown && (
        <div className="item-list" ref={dropdownRef}>
          {getFilteredOptions().map((item, index) => (
            <div
              key={item}
              className={`item ${
                index === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => handleItemSelect(item)}
              onMouseDown={(event) => handleItemMouseDown(event, item)}
            >
              {item}
            </div>
          ))}
        </div>
      )} */}
      {/* <div className="selected-items">
        {selectedItems.map((item, index) => (
          <div key={item} className="selected-item">
            {item}
            <button onClick={() => handleItemRemove(item)}>X</button>
          </div>
        ))}
      </div> */}
    </div>
  );
};
