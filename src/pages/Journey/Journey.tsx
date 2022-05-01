import React, { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJourney } from "../JourneyList/hooks/useJourneyList";
import classes from "./Journey.module.scss";
import PhotoGrid from "../../components/UI/PhotoGrid/PhotoGrid";
import { IPhotoData } from "../JourneyList/JourneyData.model";
import { FaRegTrashAlt } from "react-icons/fa";
import useHttp from "../../hooks/useHttp";
import useUploadFiles from "../../hooks/useUpload";

type Mode = "View" | "Edit";

function Journey() {
  const navigate = useNavigate();
  const photoInput = useRef<HTMLInputElement>(null);

  const { jourenyId } = useParams();
  const { journey, photoList, setPhotoList } = useJourney(Number(jourenyId));
  const { sendRequest: deletePhoto } = useHttp<void>();
  const { showProgressBar, progression, uploadFiles } = useUploadFiles();

  const [mode, setMode] = useState<Mode>("View");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  const isEditMode = useMemo(() => mode === "Edit", [mode]);

  const navigateBack = useCallback((): void => {
    navigate(-1);
  }, [navigate]);

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

  const uploadPhotoHandler = useCallback((): void => {
    if (!photoInput?.current) {
      return;
    }
    photoInput.current.click();
  }, []);

  const changeModeHandler = useCallback((): void => {
    if (mode === "Edit") {
      setMode("View");
      setSelectedPhotoIds([]);
      return;
    }
    setMode("Edit");
  }, [mode]);

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

  const deletePhotoHandler = useCallback(async () => {
    const remainingPhotoList = photoList.filter((photo) => !selectedPhotoIds.includes(photo.id));

    setPhotoList(remainingPhotoList);
    setSelectedPhotoIds([]);
    setMode("View");

    Promise.all(selectedPhotoIds.map(async (id) => await deletePhoto({ url: `https://var-resa.link/photos/${id}`, options: { method: "DELETE" } })));
  }, [photoList, selectedPhotoIds, setPhotoList, deletePhoto]);

  return journey ? (
    <article className={classes["journey-container"]}>
      <section className={classes.header}>
        <button className={classes["header-button"]} onClick={navigateBack}>
          뒤로
        </button>

        <div className={classes.spacer}></div>

        {isEditMode ? (
          <React.Fragment>
            <button className={classes["header-button"]} onClick={changeModeHandler}>
              취소
            </button>
          </React.Fragment>
        ) : (
          <button className={classes["header-button"]} onClick={changeModeHandler}>
            편집
          </button>
        )}
      </section>

      <section className={classes["journey-content-section"]}>
        <h3 className={classes.title}>{journey.title}</h3>
        <p className={classes.description}>{`${journey.startDate} - ${journey.endDate}`}</p>
        <p className={classes.description}>총 {photoList.length} 장의 사진</p>

        <div className={classes["button-wrapper"]}>
          <input type="file" accept="image/jpeg" name="upload" id="upload" multiple={true} ref={photoInput} onChange={inputChangeHandler} />
          <button disabled={isEditMode || showProgressBar} onClick={uploadPhotoHandler}>
            사진 추가
          </button>
        </div>
      </section>

      <div className={classes.divider}></div>

      <section className={`${classes["journey-content-section"]} ${classes["photo-lit"]}`}>
        <PhotoGrid photoList={photoList} selectedPhotoIds={selectedPhotoIds} onSelectPhoto={selectPhotoHandler}></PhotoGrid>
      </section>

      {isEditMode ? (
        <section className={classes.footer}>
          <FaRegTrashAlt className={`${classes.icon} ${selectedPhotoIds.length > 0 ? "" : classes.disabled}`} onClick={deletePhotoHandler}></FaRegTrashAlt>
        </section>
      ) : null}

      {showProgressBar ? <section className={classes.footer}>사진을 업로드하고 있습니다...{progression}%</section> : null}
    </article>
  ) : null;
}

export default Journey;
