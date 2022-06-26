import { useCallback, useMemo } from "react";
import useHttp, { BASE_URL } from "../../../hooks/useHttp";

type DataType = "PHOTO" | "JOURNEY";

export const useDelete = (config: { dataType: DataType }) => {
  const { sendRequest } = useHttp<void>();

  const targetUrl = useMemo(() => {
    switch (config.dataType) {
      case "JOURNEY":
        return `${BASE_URL}/journeys`;
      case "PHOTO":
        return `${BASE_URL}/photos`;
      default:
        throw new TypeError("useDelete Hook이 잘못된 값으로 초기화 되었습니다.");
    }
  }, [config.dataType]);

  const deleteItem = useCallback(
    async (id: number) => {
      try {
        await sendRequest({
          url: `${targetUrl}/${id}`,
          options: { method: "DELETE" },
        });
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
      }
    },
    [targetUrl, sendRequest]
  );

  return deleteItem;
};
