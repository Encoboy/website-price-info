function getDom() {
  let pageDom = document.getElementById("PageContainer");
  const conBoxDom = document.createElement("div");
  conBoxDom["id"] = "conBoxDom";
  conBoxDom.style.height = document.documentElement.clientHeight + "px";
  conBoxDom.style.top = document.documentElement.scrollTop + "px";
  pageDom.appendChild(conBoxDom);
  let MaxDom,
    MinDom,
    maxPrice,
    minPrice,
    newCollctionListArr = [],
    moneyList = [];
  // 总数量
  let collectionList = document.getElementsByClassName(
    "collection-list__product-tile"
  );
  let collectionListArr = Array.prototype.slice.call(collectionList); // 获取全部card
  // 拿到有渲染的价格price
  collectionListArr.map((item) => {
    const MoneySpanDomAction = item.children[0].children[0].action;
    const isImageDom = getChildren(item, [0, 0, 0, 1, 1]);
    if (MoneySpanDomAction && isImageDom) {
      const priNode = getChildren(item, [0, 0, 1, 1, 1, 0]);
      const price = priNode.innerText;
      const priceArr = price.split("");
      priceArr.shift();
      const newPrice = priceArr.join("");
      moneyList.push(Number(newPrice));
      newCollctionListArr.push(item);
    }
  });
  console.log("moneyList===", moneyList);
  const MaxIndex = moneyList.indexOf(Math.max.apply(Math, moneyList)); // 最大price dom位置
  const MinIndex = moneyList.indexOf(Math.min.apply(Math, moneyList)); // 最小price dom位置
  MaxDom = newCollctionListArr[MaxIndex];
  MinDom = newCollctionListArr[MinIndex];
  maxPrice = Math.max.apply(null, moneyList);
  minPrice = Math.min.apply(null, moneyList);
  // 概述
  GenerizaTion(newCollctionListArr, maxPrice, minPrice, conBoxDom);
  // 详情
  const detailTitleDom = document.createElement("div");
  detailTitleDom["id"] = "lineTitleBig";
  detailTitleDom.innerText = "详情";
  conBoxDom.append(detailTitleDom);
  // 本页产品中价格最高的产品
  DetailLineBox(MaxDom, maxPrice, conBoxDom);
  // 本页产品中价格最小的产品
  DetailLineBox(MinDom, minPrice, conBoxDom);
}
function GenerizaTion(newCollctionListArr, maxPrice, minPrice, conBoxDom) {
  const titleDesDom = document.createElement("div");
  titleDesDom["id"] = "lineTitleBig";
  titleDesDom.innerText = "概述";
  conBoxDom.appendChild(titleDesDom);
  const allBoxDom = document.createElement("div");
  allBoxDom["id"] = "allBoxDom";
  let allNum = newCollctionListArr.length;
  allBoxDom.innerHTML = `
	<div class="lineBox">
		<div class="Ltitle">本页产品总数量</div>
		<div class="LValue">${allNum}</div>
	</div>
	<div class="lineBox">
		<div class="Ltitle">本页产品中最高价格</div>
		<div class="LValue">$${maxPrice}</div>
	</div>
	<div class="lineBox">
		<div class="Ltitle">本页产品中最低价格</div>
		<div class="LValue">$${minPrice}</div>
	</div>`;
  conBoxDom.appendChild(allBoxDom);
}
function DetailLineBox(parentDom, price, conBoxDom) {
  const describeNode = getChildren(parentDom, [0, 0, 1, 0, 0, 0]);
  const describe = describeNode.innerText;
  const liDomNode = getChildren(parentDom, [0, 0, 0, 1, 1, 0, 0]);
  const urlArr = liDomNode.style.background.split(" ");
  const url = urlArr[0].split('"')[1];
  let DetailBoxMax = document.createElement("div");
  DetailBoxMax.innerHTML = `
<div class="detailTitle">本页产品中价格最高的产品</div>
<div class="detailBox">
	<img class="detailImg" src=${url}/>
	<div class="detailBRight">
		<div class="rightTitle">${describe}</div>
		<div>
			<span class="detailUnit>Price(USD)</span>
			<span class="detailPrice>$${price}</span>
		</div>
	</div>
</div>
</div>
`;
  conBoxDom.append(DetailBoxMax);
}

/**
 * 判断是否 children
 * @param item 父节点
 * @param arr 一个存在子/孙children的数组
 * */
function getChildren(item, arr) {
  if (!item) {
    return false;
  }
  const first = arr[0];
  let isChildValue = item.children[first];
  for (let i = 1; i < arr.length; i++) {
    if (isChildValue) {
      isChildValue = isChildValue.children[arr[i]];
    } else {
      console.log("找不到该节点children的位置===", i);
      return false;
    }
    if (i === arr.length - 1) {
      return isChildValue;
    }
  }
}

window.onload = function () {
  getDom();
};

function scrollFn() {
  let pageDom = document.getElementById("PageContainer");
  let conBox = document.getElementById("conBoxDom");
  if (conBox) {
    pageDom.removeChild(conBox);
  }
  getDom();
}

function debounce(fn, wait) {
  let timeout = null;
  return function Fn() {
    let context = this;
    let arg = [...arguments];
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, arg);
    }, wait);
  };
}
window.onscroll = debounce(scrollFn, 500);
