function download(response: any, filename: string) {
  const url = window.URL.createObjectURL(response);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
}

export default download;
