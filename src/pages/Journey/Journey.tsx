import { useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJourney } from "../JourneyList/hooks/useJourneyList";
import useHttp from "../../hooks/useHttp";
import classes from "./Journey.module.scss";
import PhotoGrid from "../../components/UI/PhotoGrid/PhotoGrid";

function Journey() {
  const { jourenyId } = useParams();
  const { journey } = useJourney(Number(jourenyId));
  const { requestState, sendRequest: deleteJourney } = useHttp<void>();

  const photoInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const navigateBack = useCallback((): void => {
    navigate(-1);
  }, [navigate]);

  const inputChangeHandler = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (!fileList?.length) {
      alert("사진이 선택되지 않았습니다.");
      return;
    }
  }, []);

  const uploadPhotoHandler = useCallback((): void => {
    if (!photoInput?.current) {
      return;
    }
    photoInput.current.click();
  }, []);

  const deletePhotoHandler = useCallback(async (): Promise<void> => {
    // TODO: Implement Confrimation Modal
    if (!journey || !window.confirm("정말 일정을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteJourney({
        url: `https://var-resa.link/journeys/${journey.id}`,
        options: { method: "DELETE" },
      });

      navigateBack();
    } catch (error) {
      console.error(error);
    }
  }, [journey, deleteJourney, navigateBack]);

  return journey ? (
    <article className={classes["journey-container"]}>
      <section className={classes.header}>
        <button className={classes["header-button"]} onClick={navigateBack}>
          뒤로
        </button>

        <div className={classes.spacer}></div>

        <button className={classes["header-button"]} onClick={deletePhotoHandler}>
          삭제
        </button>
      </section>

      <section className={classes["journey-content-section"]}>
        <h3 className={classes.title}>{journey.title}</h3>
        <p className={classes.description}>{`${journey.startDate} - ${journey.endDate}`}</p>
        <p className={classes.description}>총 {journey.photos.length} 장의 사진</p>

        <div className={classes["button-wrapper"]}>
          <input type="file" accept="image/heic, image/jpeg" name="upload" id="upload" multiple={true} ref={photoInput} onChange={inputChangeHandler} />
          <button disabled={requestState.showLoading} onClick={uploadPhotoHandler}>
            사진 추가
          </button>
        </div>
      </section>

      <div className={classes.divider}></div>

      <section className={classes["journey-content-section"]}>
        <PhotoGrid photoList={journey.photos}></PhotoGrid>
      </section>
    </article>
  ) : null;
}

export default Journey;
