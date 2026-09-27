import clsx from 'clsx';

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-soft p-6 transition-shadow duration-200',
        hover && 'hover:shadow-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
