import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <section className="w-full p-6 bg-gray-200">
      <Link className="text-[20px]" to={'/'}>
        صفحه اصلی
      </Link>
    </section>
  );
};

export default Header;
