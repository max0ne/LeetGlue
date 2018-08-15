import * as moment from 'moment';
import * as $ from 'jquery';
import * as React from "react";
import './style.css';

interface HelloProps { compiler: string; framework: string; }

const Hello = (props: HelloProps) => (<h1>Hello from {props.compiler} and {props.framework}!</h1>);

let count = 0;

$(function() {
  const queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    $('#url').text(tabs[0].url);
    $('#time').text(moment().format('YYYY-MM-DD HH:mm:ss'));
  });

  chrome.browserAction.setBadgeText({text: count.toString()});
  $('#countUp').click(()=>{
    chrome.browserAction.setBadgeText({text: (++count).toString()});
  });

  $('#changeBackground').click(()=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        color: '#555555'
      },
      function(msg) {
        console.log("result message:", msg);
      });
    });
  });
});
