import clsx from 'clsx';

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className,
  disabled,
  ...rest
}) {
  return (
    <button
      className={clsx(
        variant === 'primary' ? 'btn-primary' : 'btn-secondary',
        'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      )}
      {children}
    </button>
  );
}