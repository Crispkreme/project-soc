import React from "react";

const Table = ({
  columns,
  data,
  actions,
  onRowClick = () => {},
  noDataMessage = "No records available.",
}) => {
  return (
    <table className="w-full text-sm text-left text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col" className="px-6 py-3">
              {column.label}
            </th>
          ))}
          {actions && <th scope="col" className="px-6 py-3">Action</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, index) => (
            <tr
              key={row.id || index}
              className="bg-white border-b hover:bg-gray-50"
              onClick={() => onRowClick(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4">
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4">
                  <div className="inline-flex space-x-2">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className="bg-blue-50 text-blue-400 hover:text-blue-600 text-xs font-medium py-1 px-2 flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                      >
                        {action.icon && <action.icon className="mr-1 text-sm" />}
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + (actions ? 2 : 1)} className="text-center py-4 text-gray-500">
              {noDataMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
