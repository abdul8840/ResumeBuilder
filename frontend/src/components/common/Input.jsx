import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  success,
  hint,
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  required = false,
  className = "",
  inputClassName = "",
  id,
  name,
  autoComplete,
  maxLength,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, "-");

  const borderColor = error
    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
    : success
    ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100"
    : isFocused
    ? "border-indigo-400 focus:ring-indigo-100"
    : "border-slate-200 hover:border-slate-300";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === "left" && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon
              className={`w-4 h-4 transition-colors ${
                isFocused ? "text-indigo-500" : "text-slate-400"
              }`}
            />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`
            input-base
            ${Icon && iconPosition === "left" ? "pl-10" : ""}
            ${type === "password" || (Icon && iconPosition === "right") ? "pr-10" : ""}
            ${borderColor}
            ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}
            focus:ring-2
            ${inputClassName}
          `}
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
          {error && <AlertCircle className="w-4 h-4 text-red-500" />}
          {success && !error && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          {Icon && iconPosition === "right" && !error && !success && (
            <Icon
              className={`w-4 h-4 ${
                isFocused ? "text-indigo-500" : "text-slate-400"
              }`}
            />
          )}
        </div>
      </div>

      {/* Hint/Error/Success messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-xs text-red-500 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </motion.p>
        )}
        {success && !error && (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1.5 text-xs text-emerald-500 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            {success}
          </motion.p>
        )}
        {hint && !error && !success && (
          <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
        )}
      </AnimatePresence>

      {/* Character counter */}
      {maxLength && (
        <p className="mt-1 text-xs text-slate-400 text-right">
          {value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default Input;