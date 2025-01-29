import clsx from 'clsx';

function FlickerText({ children, className }) {
  return (
    <div className={clsx(className, 'animate-pulse text-blue-300')}>
      {children}
    </div>
  );
}
export default FlickerText;
