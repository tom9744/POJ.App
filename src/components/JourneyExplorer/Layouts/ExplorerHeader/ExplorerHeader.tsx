import React from "react";
import classes from "./ExplorerHeader.module.scss";

export type HeaderButton = {
  type: "text" | "block";
  textContent: string;
  isDisabled?: boolean;
  handler: (event: React.MouseEvent) => void;
};

type ExplorerHeaderProps = {
  backward?: boolean;
  isBackwardDisabled?: boolean;
  close?: boolean;
  isCloseDisabled?: boolean;
  leftButtons?: HeaderButton[];
  rightButtons?: HeaderButton[];
  onBackward?: (event: React.MouseEvent) => void;
  onClose?: (event: React.MouseEvent) => void;
};

function ExplorerHeader(props: ExplorerHeaderProps) {
  const {
    backward = false,
    close = false,
    isBackwardDisabled = false,
    isCloseDisabled = false,
  } = props;

  const backwardButton = backward ? (
    <button
      className={classes["text-button"]}
      disabled={isBackwardDisabled}
      onClick={props.onBackward}
    >
      <span>이전</span>
    </button>
  ) : null;

  const closeButton = close ? (
    <button
      className={classes["text-button"]}
      disabled={isCloseDisabled}
      onClick={props.onClose}
    >
      <span>닫기</span>
    </button>
  ) : null;

  return (
    <section className={classes["explorer-header"]}>
      <div className={classes["left-buttons"]}>
        {backwardButton}

        {props.leftButtons?.map(
          ({ type, textContent, handler, isDisabled = false }) => (
            <button
              className={classes[`${type}-button`]}
              disabled={isDisabled}
              onClick={handler}
            >
              {textContent}
            </button>
          )
        )}
      </div>

      <div className={classes.spacer}></div>

      <div className={classes["right-buttons"]}>
        {props.rightButtons?.map(
          ({ type, textContent, handler, isDisabled = false }) => (
            <button
              className={classes[`${type}-button`]}
              disabled={isDisabled}
              onClick={handler}
            >
              {textContent}
            </button>
          )
        )}

        {closeButton}
      </div>
    </section>
  );
}

export default ExplorerHeader;
