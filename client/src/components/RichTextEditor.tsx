import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styled from "styled-components";

const EditorWrapper = styled.div`
  .ql-container {
    min-height: 200px;
    font-size: 14px;
  }

  .ql-editor {
    min-height: 200px;
  }

  .ql-toolbar {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .ql-container {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
  "image",
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write something...",
  readOnly = false,
}) => {
  return (
    <EditorWrapper>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </EditorWrapper>
  );
};

export default RichTextEditor;
