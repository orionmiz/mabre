import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import Embed from "@editorjs/embed";
import Marker from "@editorjs/marker";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Table from "@editorjs/table";

const holder = "editorjs";

export default function Editor({
  content,
  changeContent,
  readOnly = false,
}: {
  content: EditorJS.OutputData;
  changeContent?: (data: EditorJS.OutputData) => void;
  readOnly?: boolean;
}) {
  const editorjs = useRef<EditorJS>();

  useEffect(() => {
    if (!editorjs.current) {
      const editor = new EditorJS({
        readOnly,
        autofocus: false,
        holder,
        data: content,
        minHeight: readOnly ? 50 : 100,
        onChange: async () => {
          const content = await editor.saver.save();
          changeContent?.(content);
        },
        tools: {
          header: Header,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file: File) {
                  return new Promise((resolve, reject) => {
                    // limits to 10MB
                    if (file.size > 10485760) {
                      alert("10MB 이하의 이미지만 업로드 가능합니다.");
                      resolve({
                        success: 0,
                      });
                    } else {
                      const reader = new FileReader();
                      reader.onload = () => {
                        resolve({
                          success: 1,
                          file: {
                            url: reader.result,
                          },
                        });
                      };
                      reader.onerror = () => {
                        reject(reader.error);
                      };
                      reader.readAsDataURL(file);
                    }
                  });
                },
                uploadByUrl(url: string) {
                  return new Promise((resolve) => {
                    resolve({
                      success: 1,
                      file: {
                        url,
                      },
                    });
                  });
                },
              },
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
              },
            },
          },
          Marker: {
            class: Marker,
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 2,
            },
          },
        },
        i18n: {
          messages: {
            ui: {
              blockTunes: {
                toggler: {
                  "Click to tune": "설정",
                },
              },
              inlineToolbar: {
                converter: {
                  "Convert to": "변환",
                },
              },
              toolbar: {
                toolbox: {
                  Add: "추가",
                },
              },
            },
            blockTunes: {
              delete: {
                Delete: "삭제",
              },
              moveUp: {
                "Move up": "위로 이동",
              },
              moveDown: {
                "Move down": "아래로 이동",
              },
            },
            toolNames: {
              Text: "텍스트",
              Heading: "제목",
              List: "리스트",
              Marker: "하이라이트",
              Link: "링크",
              Embed: "삽입",
              Image: "이미지",
              Table: "테이블",
            },
            tools: {
              image: {
                "Select an Image": "이미지 선택",
                Caption: "이미지 설명",
              },
              list: {
                Unordered: "순서 없음",
                Ordered: "순서 표기",
              },
              table: {
                "With headings": "구분 추가",
                "Without headings": "구분 없음",
                "Add column to left": "왼쪽에 열 추가",
                "Add column to right": "오른쪽에 열 추가",
                "Delete column": "열 삭제",
                "Add row above": "위에 행 추가",
                "Add row below": "아래에 행 추가",
                "Delete row": "행 삭제",
                Heading: "구분",
              },
              link: {
                Link: "링크",
              },
            },
          },
        },
      });

      editorjs.current = editor;
    }

    return () => {
      if (editorjs.current?.destroy) {
        editorjs.current.destroy();
        editorjs.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id={holder} className={`editorjs${readOnly ? "-readonly" : ""}`} />
  );
}
