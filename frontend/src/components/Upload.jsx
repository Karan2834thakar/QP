import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-toastify";


const Upload = () => {
  const [files, setFiles] = useState(Array(5).fill(null));
  const [uploadStatus, setUploadStatus] = useState(Array(5).fill(false));
  const [year, setYear] = useState("");
  const [subject, setSubject] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (index, event) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  };

  // Upload a single file
  const handleUpload =  async (index) => {
    if (!files[index] || !year || !subject) {
      alert("Please select a file and enter year & subject!");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[index]);
    formData.append("year", year);
    formData.append("subject", subject);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/upload", formData);
      const newStatus = [...uploadStatus];
      newStatus[index] = true;
      setUploadStatus(newStatus);
      toast.success("File uploaded successfully! ✅");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed! ❌");
    } finally {
      setLoading(false);
    }
  };

  // Predict questions
  const handlePredict = async () => {
    if (uploadStatus.filter(Boolean).length < 5) {
        toast.warn("Please upload all 5 papers first! ⚠️");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/predict/${subject}`);
      setPredictions(response.data.predictedQuestions);
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to fetch predictions!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="   bg-gradient-to-r from-gray-400 to-gray-800 ">
    <motion.div
   initial={{ x: -100, opacity: 0 }}
   animate={{ x: 0, opacity: 1 }}
   transition={{ duration: 0.5 }}
   className=" p-4 rounded-lg items-center justify-center   "
 >

    <h1 className="text-6xl font-bold text-center items-center  text-white   bg-gradient-to-r from-gray-400 to-gray-800 ">Question Paper Prediction</h1>
 </motion.div>

<div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-gray-400 to-gray-800 p-10">
 
 {/* Left: Upload Section */}
 <motion.div
   initial={{ x: -100, opacity: 0 }}
   animate={{ x: 0, opacity: 1 }}
   transition={{ duration: 0.5 }}
   className="w-full md:w-1/2 bg-gradient-to-r from-gray-500 to-gray-800 p-6 rounded-lg shadow-lg"
 >
   <h2 className="text-2xl font-bold mb-4 text-center text-black">Upload Question Papers</h2>

   <input
     type="text"
     placeholder="Enter current Year (e.g. 2025)"
     value={year}
     onChange={(e) => setYear(e.target.value)}
     className="mb-2 w-full border border-black p-2 rounded"
   />
   <input
     type="text"
     placeholder="Enter Subject (e.g. Mathematics)"
     value={subject}
     onChange={(e) => setSubject(e.target.value)}
     className="mb-4 w-full border border-black p-2 rounded"
   />

   {/* Upload Fields */}
   {files.map((file, index) => (
     <motion.div
       key={index}
       whileHover={{ scale: 1.05 }}
       className="mb-3 p-3 border-2 border-black border-dashed rounded-lg flex items-center justify-between"
     >
       <input type="file" onChange={(e) => handleFileChange(index, e)} className="w-2/3" disabled={uploadStatus[index]} />
       <button
         onClick={() => handleUpload(index)}
         className={`px-4 py-2 text-white rounded ${
           uploadStatus[index] ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
         }`}
         disabled={uploadStatus[index]}
       >
       <span className=" flex flex-row items-center gap-1 justify-between">Upload  {uploadStatus[index] ? "✅" : <FaCloudUploadAlt />}</span> 
       </button>
     </motion.div>
   ))}

   {/* Predict Questions Button */}
   <motion.button
     whileTap={{ scale: 0.95 }}
     onClick={handlePredict}
     className={`mt-4 bg-white text-black active:scale-95 px-4 py-2 rounded w-full ${
       uploadStatus.filter(Boolean).length === 5 ? "" : "opacity-50 cursor-not-allowed"
     }`}
     disabled={uploadStatus.filter(Boolean).length < 5}
   >
     Predict Questions
   </motion.button>
 </motion.div>

 {/* Right: Prediction Section */}
 <motion.div
   initial={{ x: 100, opacity: 0 }}
   animate={{ x: 0, opacity: 1 }}
   transition={{ duration: 0.5 }}
   className="w-full md:w-1/2  bg-gray-600 p-6 rounded-lg shadow-lg mt-6 md:mt-0 md:ml-6"
 >
   <h2 className="text-4xl font-bold mb-4 text-center text-black">Predicted Questions</h2>

   {/* Loading Spinner */}
   {loading && (
     <div className="flex justify-center mt-4">
       <FaSpinner className="animate-spin text-3xl text-blue-500" />
     </div>
   )}

   {/* Predicted Questions */}
   {predictions.length > 0 && (
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 0.7 }}
       className="mt-4 p-4 bg-gradient-to-r from-gray-500 to-gray-800 rounded-lg max-h-80 overflow-auto"
     >
       {predictions.map((q, i) => (
         <motion.div
           key={i}
           whileHover={{ scale: 1.02 }}
           className=" p-2 rounded my-1"
         >
           * {q}
         </motion.div>
       ))}
     </motion.div>
   )}
 </motion.div>
</div>

    </div>
  
    </>
    
  );
};

export default Upload;
