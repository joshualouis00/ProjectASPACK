import React from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

interface ViewerProps {
  fileURL: string;
}

const Viewer: React.FC<ViewerProps> = ({ fileURL }) => {
  const docs = [{ uri: fileURL }];
  console.log(docs);
  return (
    <DocViewer 
      documents={docs} 
      pluginRenderers={DocViewerRenderers} 
      style={{ height: 1200 }}
    />
  );
};

export default Viewer;

// import React, { useEffect, useState } from 'react';
// import * as XLSX from 'xlsx';

// interface ExcelViewerProps {
//   fileURL: string;
// }

// const ExcelViewer: React.FC<ExcelViewerProps> = ({ fileURL }) => {
//   const [excelData, setExcelData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(fileURL);
//         const arrayBuffer = await response.arrayBuffer();
//         const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);
//         setExcelData(jsonData);
//       } catch (error) {
//         console.error('Error reading Excel file:', error);
//       }
//     };

//     fetchData();
//   }, [fileURL]);

//   return (
//     <div>
//       <table>
//         <thead>
//           <tr>
//             {excelData.length > 0 &&
//               Object.keys(excelData[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//           </tr>
//         </thead>
//         <tbody>
//           {excelData.map((row, index) => (
//             <tr key={index}>
//               {Object.values(row).map((value, i) => (
//                 <td key={i}>
//                   {typeof value === 'string' || typeof value === 'number'
//                     ? value
//                     : JSON.stringify(value)}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ExcelViewer;

