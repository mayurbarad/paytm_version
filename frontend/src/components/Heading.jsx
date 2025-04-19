import PropTypes from "prop-types";

export function Heading({ heading }) {
  return <div className="font-bold text-4xl pt-6">{heading}</div>;
}

Heading.propTypes = {
  heading: PropTypes.string,
};
