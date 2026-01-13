import React from 'react'
import './SearchInput.css'

function SearchInput() {
    return (
      <div className="search-container">
        <i class="fas fa-search search-icon"></i>
        <input
          className="search-box"
          placeholder="Employee number (ex: 1001)"
        />
      </div>
    )
}

export default SearchInput