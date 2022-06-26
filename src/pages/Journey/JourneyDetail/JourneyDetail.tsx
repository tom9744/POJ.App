import React, { useCallback, useRef, useState } from "react";
import classes from "./JourneyDetail.module.scss";
import PhotoGrid from "../../../components/UI/PhotoGrid/PhotoGrid";
import { useNavigate, useParams } from "react-router-dom";
import { useDelete, useJourney, useUploadProgress } from "../hooks";
import { IPhotoData } from "../../../types/apis";

function Journey() {
  const photoInputElem = useRef<HTMLInputElement>(null);

  const deleteItem = useDelete({ dataType: "PHOTO" });
  const navigate = useNavigate();

  const { jourenyId } = useParams();
  const { journey, photoList, setPhotoList } = useJourney(Number(jourenyId));
  const { showProgressBar, progression, uploadFiles } = useUploadProgress();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  const toggleMode = useCallback((): void => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }
    setSelectedPhotoIds([]);
    setIsEditMode(false);
  }, [isEditMode]);

  const inputChangeHandler = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;

      if (!journey?.title || !fileList?.length) {
        alert("선택된 사진이 없습니다. 업로드 할 사진을 선택해주세요.");
        return;
      }

      const formData = new FormData();
      Array.from(fileList).forEach((file) => {
        formData.append(`images`, file);
      });
      formData.append("journeyTitle", journey.title);

      try {
        const uploadedPhotos = await uploadFiles<IPhotoData[]>("https://var-resa.link/photos", formData);

        setPhotoList([...photoList, ...uploadedPhotos]);
      } catch (error) {
        alert("업로드 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    },
    [journey, photoList, uploadFiles, setPhotoList]
  );

  const selectPhotoHandler = useCallback(
    (photoId: number): void => {
      if (!isEditMode) {
        return;
      }

      if (selectedPhotoIds.includes(photoId)) {
        setSelectedPhotoIds(selectedPhotoIds.filter((id) => id !== photoId));
        return;
      }

      setSelectedPhotoIds([...selectedPhotoIds, photoId]);
    },
    [isEditMode, selectedPhotoIds]
  );

  const deletePhotoHandler = useCallback(() => {
    if (!isEditMode) {
      return;
    }

    const remainingPhotoList = photoList.filter((photo) => !selectedPhotoIds.includes(photo.id));

    selectedPhotoIds.forEach((id) => deleteItem(id));

    setPhotoList(remainingPhotoList);
    toggleMode();
  }, [isEditMode, photoList, selectedPhotoIds, setPhotoList, toggleMode, deleteItem]);

  return journey ? (
    <article className={classes["journey-container"]}>
      <section className={classes.header}>
        {isEditMode ? (
          <button className={`${classes["header-button"]} ${classes.alert}`} disabled={selectedPhotoIds.length === 0} onClick={deletePhotoHandler}>
            사진 삭제
          </button>
        ) : (
          <button className={classes["header-button"]} onClick={() => navigate(-1)}>
            뒤로
          </button>
        )}

        <div className={classes.spacer}></div>

        <button className={classes["header-button"]} onClick={toggleMode}>
          {isEditMode ? "취소" : "편집"}
        </button>
      </section>

      <section className={classes["journey-content-section"]}>
        <h3 className={classes.title}>{journey.title}</h3>
        <p className={classes.description}>{`${journey.startDate} - ${journey.endDate}`}</p>
        <p className={classes.description}>총 {photoList.length} 장의 사진</p>

        <div className={classes["button-wrapper"]}>
          <input type="file" accept="image/jpeg" name="upload" id="upload" multiple={true} ref={photoInputElem} onChange={inputChangeHandler} />
          <button disabled={isEditMode || showProgressBar} onClick={() => photoInputElem?.current?.click()}>
            사진 추가
          </button>
        </div>
      </section>

      <div className={classes.divider}></div>

      <section className={`${classes["journey-content-section"]} ${classes["photo-list"]}`}>
        <PhotoGrid photoList={photoList} selectedPhotoIds={selectedPhotoIds} onSelectPhoto={selectPhotoHandler}></PhotoGrid>
      </section>

      {showProgressBar ? <section className={classes["progress-bar"]}>사진을 업로드하고 있습니다...{progression}%</section> : null}
    </article>
  ) : null;
}

export default Journey;
