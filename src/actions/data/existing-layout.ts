import { ContentType, Slide } from "@/lib/type";
import { v4 } from "uuid";

export const existingLayouts: Slide[] = [
  {
    id: v4(),
    slideName: "Blank Card",
    type: "blank-card",
    slideOrder: 1,
    className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "title",
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Accent Left",
    type: "accentLeft",
    slideOrder: 2,
    className: "min-h-[300px]",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      restrictToDrop: true,
      content: [
        {
          id: v4(),
          type: "resizable-column",
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: v4(),
              type: "image",
              name: "Image",
              content:
                "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Professional presentation accent image",
            },
          ],
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Image and Text",
    type: "imageAndText",
    slideOrder: 3,
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "resizable-column",
          name: "Image and text",
          className: "border",
          content: [
            {
              id: v4(),
              type: "column",
              name: "Column",
              content: [
                {
                  id: v4(),
                  type: "image",
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Professional business presentation image",
                },
              ],
            },
            {
              id: v4(),
              type: "column",
              name: "Column",
              content: [
                {
                  id: v4(),
                  type: "heading1",
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: v4(),
                  type: "paragraph",
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
              className: "w-full h-full p-8 flex items-center justify-center",
            },
          ],
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Text and Image",
    type: "textAndImage",
    slideOrder: 4,
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "resizable-column",
          name: "Text and image",
          className: "border",
          content: [
            {
              id: v4(),
              type: "column",
              name: "Column",
              content: [
                {
                  id: v4(),
                  type: "heading1",
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: v4(),
                  type: "paragraph",
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
            },
            {
              id: v4(),
              type: "column",
              name: "Column",
              content: [
                {
                  id: v4(),
                  type: "image",
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Professional presentation visual content",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Two Columns",
    type: "twoColumns",
    slideOrder: 5,
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "title",
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: v4(),
          type: "resizable-column",
          name: "Two columns layout",
          className: "border",
          content: [
            {
              id: v4(),
              type: "paragraph",
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: v4(),
              type: "paragraph",
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
        {
          id: v4(),
          type: "column",
          name: "Column",
          content: [
            {
              id: v4(),
              type: "heading3",
              name: "Heading3",
              content: "",
              placeholder: "Heading 3",
            },
            {
              id: v4(),
              type: "paragraph",
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Two Columns with Headings",
    type: "twoColumnsWithHeadings",
    slideOrder: 6,
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "title",
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: v4(),
          type: "resizable-column",
          name: "Two columns with headings",
          className: "border",
          content: [
            {
              id: v4(),
              type: "column",
              name: "Column",
              content: [
                {
                  id: v4(),
                  type: "heading3",
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: v4(),
                  type: "paragraph",
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
            {
              id: v4(),
              type: "column",
              name: "Column",
              content: [
                {
                  id: v4(),
                  type: "heading3",
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: v4(),
                  type: "paragraph",
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Three Columns",
    type: "threeColumn",
    slideOrder: 7,
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "title",
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: v4(),
          type: "resizable-column",
          name: "Three columns layout",
          className: "border",
          content: [
            {
              id: v4(),
              type: "paragraph",
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: v4(),
              type: "paragraph",
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: v4(),
              type: "paragraph",
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Title with Bullet List",
    type: "titleWithBulletList",
    slideOrder: 8,
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "title",
          name: "Title",
          content: "",
          placeholder: "Presentation Title",
        },
        {
          id: v4(),
          type: "bulletedList",
          name: "Bulleted List",
          content: ["", "", ""],
          placeholder: "List item...",
        },
      ],
    },
  },

  {
    id: v4(),
    slideName: "Quote Slide",
    type: "quoteSlide",
    slideOrder: 9,
    className: "p-8 mx-auto flex justify-center items-center min-h-[300px]",
    content: {
      id: v4(),
      type: "column",
      name: "Column",
      content: [
        {
          id: v4(),
          type: "blockquote",
          name: "Quote",
          content: "",
          placeholder: "Enter your quote here...",
        },
        {
          id: v4(),
          type: "paragraph",
          name: "Attribution",
          content: "",
          placeholder: "- Author Name",
          className: "text-right mt-4",
        },
      ],
    },
  },
];
