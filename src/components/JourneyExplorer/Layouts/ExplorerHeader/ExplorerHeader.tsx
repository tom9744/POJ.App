import React from "react";
import classes from "./ExplorerHeader.module.scss";

export type HeaderButton = {
  type: "text" | "block";
  textContent: string;
  handler: (event: React.MouseEvent) => void;
};

type ExplorerHeaderProps = {
  backward?: boolean;
  close?: boolean;
  leftButtons?: HeaderButton[];
  rightButtons?: HeaderButton[];
  onBackward?: (event: React.MouseEvent) => void;
  onClose?: (event: React.MouseEvent) => void;
};

function ExplorerHeader(props: ExplorerHeaderProps) {
  const { backward = false, close = false } = props;

  const backwardButton = backward ? (
    <button className={classes["text-button"]} onClick={props.onBackward}>
      <span>이전</span>
    </button>
  ) : null;

  const closeButton = close ? (
    <button className={classes["text-button"]} onClick={props.onClose}>
      <span>닫기</span>
    </button>
  ) : null;

  return (
    <section className={classes["explorer-header"]}>
      {backwardButton}

      {props.leftButtons?.map(({ type, textContent, handler }) => (
        <button className={classes[`${type}-button`]} onClick={handler}>
          {textContent}
        </button>
      ))}

      <div className={classes.spacer}></div>

      {props.rightButtons?.map(({ type, textContent, handler }) => (
        <button className={classes[`${type}-button`]} onClick={handler}>
          {textContent}
        </button>
      ))}

      {closeButton}
    </section>
  );
}

export default ExplorerHeader;
