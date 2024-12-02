import { Box, Button, Divider, Stack, styled, useTheme } from '@mui/material'
import './styles.css'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, EditorProvider, useCurrentEditor, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect, useState } from 'react'
import { getSecondBackgroundColor } from '../../utils/themeUtil'
import * as TablerIcons from '@tabler/icons-react'
import Placeholder from '@tiptap/extension-placeholder'
import { useSelector } from 'react-redux'

const StyledButton = styled(Button)(() => ({
    p: `${1} !important`,
    width: 'fit-content !important',
    minWidth: 0
}));

const MenuBar = ({ editor }) => {
    // const { editor } = useCurrentEditor()
    const theme = useTheme()
    const RedoIcon = TablerIcons["IconArrowForwardUp"]
    const UndoIcon = TablerIcons["IconArrowBackUp"];
    const BoldIcon = TablerIcons["IconBold"];
    const ItalicIcon = TablerIcons["IconItalic"];
    const StrikeIcon = TablerIcons["IconStrikethrough"];

    const CodeIcon = TablerIcons["IconCode"];
    const Heading1Icon = TablerIcons["IconH1"];
    const Heading2Icon = TablerIcons["IconH2"];
    const Heading3Icon = TablerIcons["IconH3"];
    const Heading4Icon = TablerIcons["IconH4"];
    const Heading5Icon = TablerIcons["IconH5"];
    const Heading6Icon = TablerIcons["IconH6"];

    const BulletListIcon = TablerIcons["IconList"];
    const OrderedListIcon = TablerIcons["IconListNumbers"]

    const CodeBlockIcon = TablerIcons["IconCodeCircle2"];
    const QuoteBlockIcon = TablerIcons["IconQuote"];


    // if (!editor) {
    //     return null
    // }

    return (
        <div className="control-group">
            <Stack
                direction={'row'}
                spacing={1}
                className="button-group"
                useFlexGap
                sx={{ flexWrap: 'wrap' }}
                mb={2}
            >
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .undo()
                            .run()
                    }
                    variant={'outlined'}
                >
                    <UndoIcon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .redo()
                            .run()
                    }
                    variant={'outlined'}
                >
                    <RedoIcon size={16} />
                </StyledButton>
                <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} />
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    variant={editor.isActive('bold') ? 'contained' : 'outlined'}
                >
                    <BoldIcon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    variant={editor.isActive('italic') ? 'contained' : 'outlined'}
                >
                    <ItalicIcon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    variant={editor.isActive('strike') ? 'contained' : 'outlined'}
                >
                    <StrikeIcon size={16} />
                </StyledButton>
                <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} />
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleCode()
                            .run()
                    }
                    // className={editor.isActive('code') ? 'is-active' : ''}
                    variant={editor.isActive('code') ? 'contained' : 'outlined'}
                >
                    <CodeIcon size={16} />
                </StyledButton>
                {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                    Clear marks
                </button>
                <button onClick={() => editor.chain().focus().clearNodes().run()}>
                    Clear nodes
                </button> */}
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    variant={editor.isActive('paragraph') ? 'contained' : 'outlined'}
                >
                    Paragraph
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    variant={editor.isActive('heading', { level: 1 }) ? 'contained' : 'outlined'}
                >
                    <Heading1Icon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}
                >
                    <Heading2Icon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    variant={editor.isActive('heading', { level: 3 }) ? 'contained' : 'outlined'}
                >
                    <Heading3Icon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    variant={editor.isActive('heading', { level: 4 }) ? 'contained' : 'outlined'}
                >
                    <Heading4Icon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    variant={editor.isActive('heading', { level: 5 }) ? 'contained' : 'outlined'}
                >
                    <Heading5Icon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    variant={editor.isActive('heading', { level: 6 }) ? 'contained' : 'outlined'}
                >
                    <Heading6Icon size={16} />
                </StyledButton>

                <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} />
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                    variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
                >
                    <BulletListIcon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
                >
                    <OrderedListIcon size={16} />
                </StyledButton>

                <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 1 }} />
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    variant={editor.isActive('codeBlock') ? 'contained' : 'outlined'}
                >
                    <CodeBlockIcon size={16} />
                </StyledButton>
                <StyledButton
                    size='small'
                    color={theme.palette.mode == 'light' ? 'customBlack' : 'customWhite'}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    variant={editor.isActive('blockquote') ? 'contained' : 'outlined'}
                >
                    <QuoteBlockIcon size={16} />
                </StyledButton>
                {/* <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    Horizontal rule
                </button>
                <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                    Hard break
                </button> */}

                {/* <button
                    onClick={() => editor.chain().focus().setColor('#958DF1').run()}
                    className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
                >
                    Purple
                </button> */}
            </Stack>
        </div>
    )
}

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    Placeholder.configure({
        placeholder: 'Write something …',
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: false,
    }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
]

export const CustomLongTextEditor = ({ content, setContent, saveContent }) => {
    const [editable, setEditable] = useState(false);
    const currentMember = useSelector((state) => state.member.currentUserMember);
    const editor = useEditor({
        extensions: extensions,
        content: content,
        editable: !currentMember?.role?.projectPermissions?.includes("EDIT_TASKS"),
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },

    })
    const theme = useTheme();

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(content)
        }
    }, [content])

    useEffect(() => {
        if (editor) {
            editor.setEditable(editable)
        }
    }, [editable, editor])

    const handleClick = () => {
        setEditable(true)
    };

    return (
        <Box p={2} bgcolor={getSecondBackgroundColor(theme)} borderRadius={2}>
            {editable && <MenuBar editor={editor} />}
            <Box onClick={handleClick}>
                <EditorContent
                    editor={editor}
                    style={{
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 4,
                        padding: 8,
                        minHeight: '100px'
                    }}
                />
            </Box>
            {editable &&

                <Stack direction={'row'} spacing={2} mt={2}>
                    <Button size='small' variant='contained' color='success' onClick={() => {
                        saveContent();
                        setEditable(false)
                    }}>
                        Save
                    </Button>
                    <Button size='small' variant='outlined' color='error' onClick={() => setEditable(false)}>
                        Cancle
                    </Button>
                </Stack>
            }
        </Box>
    )
}