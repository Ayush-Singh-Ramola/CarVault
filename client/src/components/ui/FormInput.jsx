import { forwardRef } from 'react';
import clsx from 'clsx';

const FormInput = forwardRef(function FormInput(
  { label, error, type = 'text', className, ...rest },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={clsx(
          'input-field',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error.message}</p>
      )}
    </div>
  );
});

export default FormInput;