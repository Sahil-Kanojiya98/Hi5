import PropTypes from 'prop-types';

const Echohub = ({ classNames }) => (
  <h1
    className={
      'text-5xl font-bebas font-bold italic text-blue-400 shadow-lg ' +
      classNames
    }
  >
    Echohub
  </h1>
);

Echohub.propTypes = {
  classNames: PropTypes.string,
};

export default Echohub;
