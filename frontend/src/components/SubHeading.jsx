import PropTypes from "prop-types";

export function SubHeading({ subheading }) {
  return (
    <div className="text-slate-500 text-md pt-1 px-4 pb-4">{subheading}</div>
  );
}

SubHeading.propTypes = {
  subheading: PropTypes.string,
};
