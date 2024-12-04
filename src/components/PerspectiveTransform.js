import React, { useState, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';

const PerspectiveContainer = styled.div`
  width: fit-content;
  position: relative;
`;

const ControlPoint = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
`;

const PerspectiveTransform = ({ children }) => {
  const containerRef = useRef(null);
  const [points, setPoints] = useState({
    topLeft: { x: 0, y: 0 },
    topRight: { x: 100, y: 0 },
    bottomRight: { x: 100, y: 100 },
    bottomLeft: { x: 0, y: 100 },
  });
  const [matrix, setMatrix] = useState('');
  const [editable, setEditable] = useState(false); // Editable state

  // Use useLayoutEffect to ensure the DOM is ready
  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Ensure width and height are not zero
      if (rect.width > 0 && rect.height > 0) {
        setPoints({
          topLeft: { x: 0, y: 0 },
          topRight: { x: rect.width, y: 0 },
          bottomRight: { x: rect.width, y: rect.height },
          bottomLeft: { x: 0, y: rect.height },
        });
      }
    }
  }, [children]); // Re-run when children change

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return; // Skip if dimensions are zero

      const srcCorners = [
        { x: 0, y: 0 },
        { x: rect.width, y: 0 },
        { x: rect.width, y: rect.height },
        { x: 0, y: rect.height },
      ];
      const dstCorners = [
        points.topLeft,
        points.topRight,
        points.bottomRight,
        points.bottomLeft,
      ];
      const transform = computeCssMatrix(srcCorners, dstCorners);
      setMatrix(transform);
    }
  }, [points]);

  const handleDrag = (e, corner) => {
    e.preventDefault();
    e.stopPropagation();

    const onMove = (event) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setPoints((prevPoints) => ({
          ...prevPoints,
          [corner]: { x, y },
        }));
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Toggle editable state with Shift+P
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        setEditable((prevEditable) => !prevEditable);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function computeCssMatrix(srcPoints, dstPoints) {
    function adj(m) {
      return [
        m[4] * m[8] - m[5] * m[7],
        m[2] * m[7] - m[1] * m[8],
        m[1] * m[5] - m[2] * m[4],
        m[5] * m[6] - m[3] * m[8],
        m[0] * m[8] - m[2] * m[6],
        m[2] * m[3] - m[0] * m[5],
        m[3] * m[7] - m[4] * m[6],
        m[1] * m[6] - m[0] * m[7],
        m[0] * m[4] - m[1] * m[3],
      ];
    }

    function multmm(a, b) {
      var c = [];
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          var cij = 0;
          for (var k = 0; k < 3; k++) {
            cij += a[3 * i + k] * b[3 * k + j];
          }
          c[3 * i + j] = cij;
        }
      }
      return c;
    }

    function basisToPoints(p1, p2, p3, p4) {
      var m = [
        p1.x, p2.x, p3.x,
        p1.y, p2.y, p3.y,
        1, 1, 1,
      ];
      var v = [p4.x, p4.y, 1];
      var s = solve(m, v);
      if (s === null) return null;
      var m2 = [
        m[0] * s[0], m[1] * s[1], m[2] * s[2],
        m[3] * s[0], m[4] * s[1], m[5] * s[2],
        m[6] * s[0], m[7] * s[1], m[8] * s[2],
      ];
      return m2;
    }

    function solve(A, b) {
      // Solve A * x = b
      var det =
        A[0] * (A[4] * A[8] - A[5] * A[7]) -
        A[1] * (A[3] * A[8] - A[5] * A[6]) +
        A[2] * (A[3] * A[7] - A[4] * A[6]);

      if (det === 0) return null;

      var invDet = 1 / det;

      var adjA = [
        (A[4] * A[8] - A[5] * A[7]) * invDet,
        (A[2] * A[7] - A[1] * A[8]) * invDet,
        (A[1] * A[5] - A[2] * A[4]) * invDet,
        (A[5] * A[6] - A[3] * A[8]) * invDet,
        (A[0] * A[8] - A[2] * A[6]) * invDet,
        (A[2] * A[3] - A[0] * A[5]) * invDet,
        (A[3] * A[7] - A[4] * A[6]) * invDet,
        (A[1] * A[6] - A[0] * A[7]) * invDet,
        (A[0] * A[4] - A[1] * A[3]) * invDet,
      ];

      return [
        adjA[0] * b[0] + adjA[1] * b[1] + adjA[2] * b[2],
        adjA[3] * b[0] + adjA[4] * b[1] + adjA[5] * b[2],
        adjA[6] * b[0] + adjA[7] * b[1] + adjA[8] * b[2],
      ];
    }

    var m1 = basisToPoints(srcPoints[0], srcPoints[1], srcPoints[2], srcPoints[3]);
    var m2 = basisToPoints(dstPoints[0], dstPoints[1], dstPoints[2], dstPoints[3]);
    if (m1 === null || m2 === null) return '';

    var m3 = multmm(m2, adj(m1));

    // Normalize the matrix
    for (var i = 0; i < m3.length; i++) {
      m3[i] = m3[i] / m3[8];
    }

    var matrix3d = [
      m3[0], m3[3], 0, m3[6],
      m3[1], m3[4], 0, m3[7],
      0, 0, 1, 0,
      m3[2], m3[5], 0, m3[8],
    ];

    return 'matrix3d(' + matrix3d.join(',') + ')';
  }

  return (
    <PerspectiveContainer ref={containerRef}>
      <div
        style={{
          transform: matrix,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>

      {editable &&
        Object.entries(points).map(([corner, { x, y }]) => (
          <ControlPoint
            key={corner}
            style={{ left: x, top: y }}
            onMouseDown={(e) => handleDrag(e, corner)}
          />
        ))}
    </PerspectiveContainer>
  );
};

export default PerspectiveTransform;
