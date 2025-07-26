import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { TextField } from '@mui/material';

interface SimpleNumberInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  allowNegative?: boolean;
}

export interface SimpleNumberInputRef {
  getCurrentValue: () => string;
}

const SimpleNumberInput = forwardRef<SimpleNumberInputRef, SimpleNumberInputProps>(
  ({ label, value, onChange, placeholder, allowNegative = false }, ref) => {
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
      let numericValue = event.target.value;
      
      if (allowNegative) {
        // Разрешаем цифры и минус только в начале
        numericValue = numericValue.replace(/[^0-9-]/g, '');
        // Убираем лишние минусы
        const minusCount = (numericValue.match(/-/g) || []).length;
        if (minusCount > 1) {
          numericValue = numericValue.replace(/-/g, '');
          if (event.target.value.startsWith('-')) {
            numericValue = '-' + numericValue;
          }
        } else if (numericValue.includes('-') && !numericValue.startsWith('-')) {
          numericValue = numericValue.replace('-', '');
        }
      } else {
        // Только цифры
        numericValue = numericValue.replace(/[^0-9]/g, '');
      }
      
      setLocalValue(numericValue);
      // НЕ вызываем onChange - пусть пользователь сам нажмет "Применить фильтры"
    }, [allowNegative]);

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
          pattern: allowNegative ? '-?[0-9]*' : '[0-9]*'
        }}
      />
    );
  }
);

SimpleNumberInput.displayName = 'SimpleNumberInput';

export default React.memo(SimpleNumberInput); 