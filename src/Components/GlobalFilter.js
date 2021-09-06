import React from "react";

export const GlobalFilter = ({filter, setFilter}) => {
    return (
        <div>                 
            <div className="mb-3">
                <label className="form-label">Search by name and description:</label> 
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type to search..."
                    value={filter || ''} 
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </div>
    )
}