import clsx from 'clsx';

function FlickerText({ children, className }) {
  return (
    <div className={clsx(className, 'animate-pulse')}>
      {children}
    </div>
  );
}
export default FlickerText;
