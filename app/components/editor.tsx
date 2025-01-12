import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import type { $$notes } from "~/routes/notes/notes";

import { useCallback, useEffect, useMemo, useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { mergeRegister } from "@lexical/utils";
import {
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { tv } from "tailwind-variants";

import { Icons } from "~/components/icons";
import { noteFormatter } from "~/utils/misc";

export type EditorOnChangeState = Pick<
  typeof $$notes.schema.$infer,
  "title" | "preview" | "content"
>;

const LOW_PRIORITY = 1;
const EDITOR_PLACEHOLDER = "Enter your note...";
const INITIAL_CONFIG = {
  namespace: "NotesEditor",
  theme: {
    text: {
      bold: "font-semibold text-zinc-900",
      underline: "underline",
      strikethrough: "line-through",
      underlineStrikethrough: "[text-decoration-line:underline_line-through]",
    },
  },
  onError: (err) => console.log(err),
} satisfies InitialConfigType;

const tvEditor = tv({
  slots: {
    container: "relative overflow-hidden rounded-xl border bg-white shadow-sm",
    containerInner: "relative font-normal",
    input:
      "relative min-h-96 px-4 py-3 text-sm/6 text-zinc-700 focus:outline-none",
    placeholder:
      "pointer-events-none absolute left-4 top-3 select-none text-sm/6 text-zinc-500",
    toolbar:
      "flex items-center divide-x overflow-x-auto overflow-y-hidden border-b py-1 [scrollbar-width:thin]",
    toolbarGroup: "flex items-center gap-1 px-1",
    toolbarGroupItem:
      "rounded-lg bg-transparent p-2 text-zinc-700 transition-colors hover:bg-black/10 hover:text-zinc-950 focus:bg-black/10 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-black/10 data-[active=true]:text-zinc-950 [&_svg]:size-4",
  },
})();

export interface EditorProps {
  initContent?: string | null;
  onChange: (state: EditorOnChangeState) => void;
}

const Editor: React.FC<EditorProps> = ({ initContent, onChange }) => {
  const initialConfig = useMemo(
    () =>
      ({
        ...INITIAL_CONFIG,
        editorState(editor) {
          if (initContent) {
            const parser = new DOMParser();
            const dom = parser.parseFromString(initContent, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);

            $getRoot().select();
            $insertNodes(nodes);
          }
        },
      }) satisfies InitialConfigType,
    [initContent],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={tvEditor.container()}>
        <EditorToolbar />
        <div className={tvEditor.containerInner()}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={tvEditor.input()}
                aria-placeholder={EDITOR_PLACEHOLDER}
                placeholder={
                  <div className={tvEditor.placeholder()}>
                    {EDITOR_PLACEHOLDER}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
};

const OnChangePlugin: React.FC<Pick<EditorProps, "onChange">> = ({
  onChange,
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const state = editorState.read((): EditorOnChangeState => {
        const root = $getRoot();
        const text = root.getTextContent();

        if (text.trim().length === 0) {
          return {
            title: undefined,
            preview: undefined,
            content: undefined,
          };
        }

        const title = (() => {
          for (const child of $getRoot().getChildren()) {
            const text = child.getTextContent();
            if (text.trim().length > 0) {
              return noteFormatter(text);
            }
          }
        })();
        const preview = noteFormatter(text, 168, title);
        const content = $generateHtmlFromNodes(editor);

        return {
          title,
          content,
          preview: preview !== "" ? preview : undefined,
        };
      });
      onChange(state);
    });
  });

  return null;
};

const EditorToolbar: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LOW_PRIORITY,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LOW_PRIORITY,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LOW_PRIORITY,
      ),
    );
  }, [editor, updateToolbar]);

  return (
    <div className={tvEditor.toolbar({ className })} {...rest}>
      <EditorToolbarGroup>
        <EditorToolbarGroupItem
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        >
          <Icons.undo />
        </EditorToolbarGroupItem>
        <EditorToolbarGroupItem
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          <Icons.redo />
        </EditorToolbarGroupItem>
      </EditorToolbarGroup>
      <EditorToolbarGroup>
        <EditorToolbarGroupItem
          data-active={isBold}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        >
          <Icons.bold />
        </EditorToolbarGroupItem>
        <EditorToolbarGroupItem
          data-active={isItalic}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        >
          <Icons.italic />
        </EditorToolbarGroupItem>
        <EditorToolbarGroupItem
          data-active={isUnderline}
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
        >
          <Icons.underline />
        </EditorToolbarGroupItem>
        <EditorToolbarGroupItem
          data-active={isStrikethrough}
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
          }
        >
          <Icons.strikethrough />
        </EditorToolbarGroupItem>
      </EditorToolbarGroup>
      <EditorToolbarGroup>
        <EditorToolbarGroupItem
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        >
          <Icons.alignleft />
        </EditorToolbarGroupItem>
        <EditorToolbarGroupItem
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
          }
        >
          <Icons.aligncenter />
        </EditorToolbarGroupItem>
        <EditorToolbarGroupItem
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
          }
        >
          <Icons.alignright />
        </EditorToolbarGroupItem>
        <EditorToolbarGroupItem
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
          }
        >
          <Icons.alignjustify />
        </EditorToolbarGroupItem>
      </EditorToolbarGroup>
    </div>
  );
};

const EditorToolbarGroup: React.FC<React.ComponentPropsWithRef<"div">> = ({
  className,
  ...rest
}) => {
  return <div className={tvEditor.toolbarGroup({ className })} {...rest} />;
};

const EditorToolbarGroupItem: React.FC<
  React.ComponentPropsWithRef<"button">
> = ({ className, ...rest }) => {
  return (
    <button className={tvEditor.toolbarGroupItem({ className })} {...rest} />
  );
};

export { Editor };
