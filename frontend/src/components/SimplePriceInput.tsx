import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { TextField } from '@mui/material';

interface SimplePriceInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface SimplePriceInputRef {
  getCurrentValue: () => string;
}

const SimplePriceInput = forwardRef<SimplePriceInputRef, SimplePriceInputProps>(
  ({ label, value, onChange, placeholder }, ref) => {
    const [localValue, setLocalValue] = useState(value);

    // Синхронизируем локальное значение с внешним только при внешних изменениях
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // Предоставляем доступ к текущему значению через ref
    useImperativeHandle(ref, () => ({
      getCurrentValue: () => localValue
    }), [localValue]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      // Простая фильтрация только цифр
      const numericValue = event.target.value.replace(/[^0-9]/g, '');
      setLocalValue(numericValue);
      // НЕ вызываем onChange - пусть пользователь сам нажмет "Применить фильтры"
    }, []);

    // Вызываем onChange только когда поле теряет фокус (опционально)
    const handleBlur = useCallback(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, [localValue, value, onChange]);

    return (
      <TextField
        size="small"
        label={label}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        sx={{ flex: 1 }}
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*'
        }}
      />
    );
  }
);

SimplePriceInput.displayName = 'SimplePriceInput';

export default React.memo(SimplePriceInput); 