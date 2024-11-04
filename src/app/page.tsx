"use client";

import { useEffect, useState } from "react";
import GrapesJS, { Editor } from "grapesjs";
import pt from "grapesjs/locale/pt";

import "grapesjs/dist/css/grapes.min.css";

// Import GrapesJS plugins
import presetWebpage from "grapesjs-preset-webpage";
import pluginForms from "grapesjs-plugin-forms";
import blocksBasic from "grapesjs-blocks-basic";
import navbar from "grapesjs-navbar";
import styleGradient from "grapesjs-style-gradient";
import styleFilter from "grapesjs-style-filter";
import styleBg from "grapesjs-style-bg";
import blocksFlexbox from "grapesjs-blocks-flexbox";
import tooltip from "grapesjs-tooltip";
import customCode from "grapesjs-custom-code";
import Link from "next/link";
import { runLighthouse } from "@/actions/lighthouse";

export default function EditorPage() {
  const [editor, setEditor] = useState<Editor>();

  // Manually save the project data to local storage
  const saveOnLocalStorage = async () => {
    if (editor) {
      const pageResources = {
        html: editor?.getHtml(),
        css: editor?.getCss(),
        js: editor?.getJs(),
      };

      localStorage.setItem("page-resources", JSON.stringify(pageResources));
      await editor.store();
    }
  };

  // Manually load the project data from local storage
  const loadFromLocalStorage = async () => {
    if (editor) {
      await editor.load();
    }
  };

  useEffect(() => {
    if (!editor) {
      const editorInstance = GrapesJS.init({
        container: "#editor",
        fromElement: true,
        i18n: {
          messages: { pt },
        },
        plugins: [
          presetWebpage,
          pluginForms,
          blocksBasic,
          navbar,
          styleGradient,
          styleFilter,
          styleBg,
          blocksFlexbox,
          tooltip,
          customCode,
        ],
        storageManager: {
          type: "local",
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
          onStore: (data, editor) => {
            const pageResources = {
              html: editor.getHtml(),
              css: editor.getCss(),
              js: editor.getJs(),
            };

            localStorage.setItem(
              "page-resources",
              JSON.stringify(pageResources)
            );

            return data;
          },
          options: {
            local: { key: "component-definition" },
          },
        },
      });

      setEditor(editorInstance);
    }
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
      <div id="editor" />

      <div className="flex items-center justify-center gap-8 w-96 p-4 flex-col">
        <button
          className="bg-white text-black p-4 rounded-md"
          onClick={saveOnLocalStorage}
        >
          Save to template
        </button>

        <button
          className="bg-white text-black p-4 rounded-md"
          onClick={loadFromLocalStorage}
        >
          Load template
        </button>

        <Link href="/template" className="bg-white text-black p-4 rounded-md">
          Render page
        </Link>

        <button
          className="bg-white text-black p-4 rounded-md"
          onClick={runLighthouse}
        >
          Generate report
        </button>
      </div>
    </div>
  );
}
