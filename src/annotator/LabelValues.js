import React, { useEffect, useState } from 'react';
import { Box, makeStyles, useEventCallback } from "@material-ui/core";
import CommonTabs from '../components/CommonTabs';
import { FormInputText } from '../components/FormElements';


function getRegionsInPixels(pixelSize, regions) {
  let {w:iw, h:ih} = pixelSize;


  return regions.map((region)=>{
    let {x, y, w, h} = region;
    const inner = [
      [x * iw, y * ih],
      [x * iw + w * iw, y * ih],
      [x * iw + w * iw, y * ih + h * ih],
      [x * iw, y * ih + h * ih],
    ]
    return {
      ...region,
      pixel: inner
    }
  });
}

function getCurrRegionMinMax(pixelSize, regions) {
  for(let i=0; i<regions.length; i++) {
    if(regions[i].highlighted) {
      let {w:iw, h:ih} = pixelSize;
      let {x, y, w, h} = regions[i];
      return {
        cls: regions[i].cls,
        xmin: x * iw,
        ymin: y * ih,
        xmax: x * iw + w * iw,
        ymax: y * ih + h * ih
      }
    }
  }
  // return regions.map((region)=>{
  //   let {x, y, w, h} = region;
  //   // const inner = [
  //   //   [x * iw, y * ih],
  //   //   [x * iw + w * iw, y * ih],
  //   //   [x * iw + w * iw, y * ih + h * ih],
  //   //   [x * iw, y * ih + h * ih],
  //   // ]
  //   return {
  //     ...region,
  //     xmin: x * iw,
  //     ymin: y * ih,
  //     xmax: x * iw + w * iw,
  //     ymax: y * ih + h * ih
  //   }
  // });
}

function rectanglesIntersect(
  minAx, minAy, maxAx, maxAy,
  minBx, minBy, maxBx, maxBy ) {
  let aLeftOfB = maxAx < minBx;
  let aRightOfB = minAx > maxBx;
  let aAboveB = minAy > maxBy;
  let aBelowB = maxAy < minBy;

  return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
}

export default function LabelValues({activeImage, labelsData, setLabelsData}) {
  const onTextChange = useEventCallback((e)=>{
    let {name, value} = e.target;
    setLabelsData({
      ...labelsData,
      [name]: value,
    });
  });

  useEffect(()=>{
    // setLabelsTagged(regions.map((region)=>region.cls||));

    if(activeImage.pixelSize) {
      let currRegionDims = getCurrRegionMinMax(activeImage.pixelSize, activeImage.regions);
      if(currRegionDims) {
        let {xmin, ymin, xmax, ymax} = currRegionDims;
        let intersects = [];
        activeImage.region_values.forEach((region_val)=>{
          if(rectanglesIntersect(region_val.xmin, region_val.ymin, region_val.xmax, region_val.ymax, xmin, ymin, xmax, ymax)) {
            intersects.push(region_val.value);
          }
        });

        if(currRegionDims.cls && !labelsData[currRegionDims.cls] && labelsData[currRegionDims.cls] != '') {
          setLabelsData({
            ...labelsData,
            [currRegionDims.cls]: intersects.join(' '),
          });
        }
      }
    }
  }, [activeImage.regions]);

  return (
    <>
      {labelsData && Object.keys(labelsData).map((labelName, i)=>{
        return <>
          <FormInputText name={labelName} label={labelName} value={labelsData[labelName]}
            onChange={onTextChange}
            // disabled={labelsTagged.indexOf(labelName) < 0}
            />
        </>
      })}
    </>
  );
}