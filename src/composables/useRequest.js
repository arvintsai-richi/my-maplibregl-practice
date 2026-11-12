import { HttpRequest } from '@/api/HttpService';
import { computed, ref } from 'vue';

/**
 * Vue 組合函數，用於處理 HttpService.defineRequest 所定義的請求。
 * @param {HttpRequest} axiosRequest - 來自 HttpService 的 Request 類別實例。
 * @returns 包含處理請求的響應式屬性和方法的物件。
 */
export function useRequest(axiosRequest, options = { defaultData: null }) {
  if (!(axiosRequest instanceof HttpRequest)) {
    throw new Error('請透過 HttpService.defineRequest() 定義請求。');
  }

  const errorCallBack = new Set();
  const { defaultData } = options;
  const isLoading = computed(() => pengingPromises.value.size > 0);
  const isFinished = computed(
    () => !isLoading.value && data.value !== defaultData,
  );
  const data = ref(defaultData);
  const pengingPromises = ref(new Set());

  /**
   * 發送請求
   * @param {Object} urlParams
   * @param {Object} bodyData
   * @returns
   */
  async function send(urlParams, bodyData) {
    if (isLoading.value) {
      axiosRequest.abort('重發請求。');
      pengingPromises.value.clear();
    }

    let requestPromise = axiosRequest.send(urlParams, bodyData);
    pengingPromises.value.add(requestPromise);
    data.value = defaultData;

    try {
      const result = await requestPromise;
      data.value = result;
    } catch (error) {
      // Resend and abort will not throw an error
      if (error.code == 'ERR_CANCELED') {
        return;
      }

      // 沒註冊 errorCallBack 就直接拋出錯誤
      if (errorCallBack.size == 0) {
        throw error;
      }

      for (let callback of errorCallBack) {
        await callback(error);
      }
    } finally {
      pengingPromises.value.delete(requestPromise);
    }
  }

  /**
   * 註冊 errorCallBack
   * @param {Function} callback
   */
  function onError(callback) {
    errorCallBack.add(callback);
  }

  return {
    isLoading,
    isFinished,
    data,
    send,
    stop: axiosRequest.abort,
    onError,
  };
}
