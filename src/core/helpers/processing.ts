

export const processErrors = (errors) => {
    let errorHtml = '<ul class="text-danger">';
    for (const [key, value] of Object.entries(errors)) {
      if (Array.isArray(value)) {
        errorHtml += `<li>${key}: ${value.join(', ')}</li>`;
      } else if (typeof value === 'object') {
        errorHtml += `<li>${key}:<ul>`;
        for (const [subKey, subValue] of Object.entries(value)) {
          errorHtml += `<li>${subKey}: ${subValue.join(', ')}</li>`;
        }
        errorHtml += `</ul></li>`;
      } else if (typeof value === 'string') {
        errorHtml += `<li>${key}: ${value}</li>`;
      }
    }
    errorHtml += '</ul>';
    return errorHtml;
};

export const convertToFormData = (data, formData = new FormData(), parentKey = '') => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
          const value = data[key];
          if (value !== null && value !== undefined) {
              convertToFormData(value, formData, parentKey ? `${parentKey}[${key}]` : key);
          }
      });
  } else if (data !== null && data !== undefined) {
      console.log("Appending: ", parentKey, data);
      formData.append(parentKey, data);
  }
  return formData;
};

export const debounce = (func, wait) =>{
    let timeout;
    return function (...args) {
        return new Promise((resolve, reject) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            try {
            const result = await func.apply(this, args);
            resolve(result);
            } catch (error) {
            reject(error);
            }
        }, wait);
        });
    };
}