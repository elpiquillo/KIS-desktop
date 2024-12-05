import React from 'react';
import PdfReader from 'src/components/pdf-reader/pdf-reader';

interface Props {
  data: any;
}

export default function TableCellContent({ data }: Props) {
  const isNumeric = () => {
    if (+data) {
      if (/^0[0-9].*$/.test(data)) {
        return data;
      }
      if (+data > 9999999999) {
        return data;
      }
      const number = +data;
      return number;
    }
    return null;
  };

  const isClassicDate = () => {
    if (typeof data === 'number') {
      return null;
    }
    const isIt = data.match(
      /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/ // eslint-disable-line
    );
    const date = new Date(data);
    return isIt ? date.toLocaleDateString() : null;
  };

  const isDateTime = () => {
    if (typeof data === 'number') {
      return null;
    }

    const isIt = data.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
    const isIt2 = data.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    const date = new Date(data);

    return isIt || isIt2 ? date.toLocaleString() : null;
  };

  const isImgOrDocument = () => {
    const { original } = data;
    return original !== undefined;
  };

  if (typeof data === 'boolean') {
    return String(data);
  }

  if (!data) {
    return data;
  }

  if (typeof data === 'object') {
    if (isImgOrDocument()) {
      const { original, file_name, thumbnail } = data;
      if (original.indexOf('.png') !== -1) {
        return (
          <a href={original} target="_blank" rel="noopener noreferrer">
            <img src={thumbnail} alt={file_name} style={{ maxHeight: 100, maxWidth: 100 }} />
          </a>
        );
      }
      const ext = original.split('.').pop().split('?')[0];
      if (ext === 'pdf') {
        return <PdfReader link={original} name={file_name} />;
      }

      return (
        <a
          color="link"
          href={original}
          target="_blank"
          rel="noreferrer"
          className="btn text-dark fw-medium"
        >
          {file_name}
        </a>
      );
    }
    const { $oid } = data;
    return $oid;
  }

  if (isDateTime()) {
    return isDateTime();
  }

  if (isClassicDate()) {
    return isClassicDate();
  }

  if (isNumeric()) {
    return isNumeric();
  }

  return data;
}
