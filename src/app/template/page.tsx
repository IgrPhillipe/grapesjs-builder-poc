"use client";

export default function Template() {
  const pageData = localStorage.getItem("page-resources");

  if (!pageData) {
    return null;
  }

  const data = JSON.parse(pageData);

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      dangerouslySetInnerHTML={{
        __html:
          data.html + `<style>${data.css}</style><script>${data.js}</script>`,
      }}
    ></div>
  );
}
