const ActionBox = ({ icon, text, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-4 rounded-xl 
      ${disabled ? "bg-gray-600" : "bg-gray-800 hover:bg-gray-700"} 
      transition shadow-md`}
  >
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 mb-2 text-blue-400">
      {icon}
    </div>
    <span className="text-sm text-gray-200 font-medium">{text}</span>
  </button>
);

export default ActionBox