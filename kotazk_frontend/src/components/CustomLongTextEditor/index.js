import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "@mui/material";

const darkTheme = {
  editor: {
    text: "#fff",
    background: "#383838",
  },
}

function CustomLongTextEditor() {
  const theme = useTheme();
  const editor = useCreateBlockNote();

  return <BlockNoteView
    editor={editor}
    theme={theme.palette.mode === "light" ? "light" : "dark"} 
    // theme={darkTheme}

  />;
}

export default CustomLongTextEditor;;