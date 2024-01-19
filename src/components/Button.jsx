import PropTypes from "prop-types";

const Button = ({ children }) => {
  return (
    <button className="bg-gray-700 text-white rounded-lg px-4 py-2">
      {children}
    </button>
  );
};

Button.propType = {
  children: PropTypes.object,
};
export default Button;
