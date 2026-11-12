import { ref } from 'vue';

export function useCounter(initialValue = 0) {
  // 計數器狀態
  const count = ref(initialValue);

  // 增加計數
  const increment = (value = 1) => {
    count.value += value;
  };

  // 減少計數
  const decrement = (value = 1) => {
    count.value -= value;
  };

  // 重設計數
  const reset = (value = initialValue) => {
    count.value = value;
  };

  // 設置新計數值
  const setCount = (value) => {
    count.value = value;
  };

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
