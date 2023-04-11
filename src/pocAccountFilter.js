import React, { useState } from 'react';

const EmpdataFilter = ({ empdata, onFilterChange }) => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const handleAccountChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setSelectedAccounts(selectedValues);
    onFilterChange(selectedValues);
  }

  const allAccounts = [...new Set(empdata.map((item) => item.ACCOUNT_NAME))];
  
  return (
    <div>
      {/* <label htmlFor="account-select">Filter by Account:</label> */}
      <select
        id="account-select"
        className='form-select account-dropdown'
        value={selectedAccounts}
        onChange={handleAccountChange}
      >
        {allAccounts.map((account) => (
          <option key={account} value={account}>{account}</option>
        ))}
      </select>
    </div>
  );
}



export default EmpdataFilter;
