var NO_DATA = 1, NOT_COVERED = 1, ALL_COVERED = 2, PARTLY_COVERED = 3;


var CodeParents = [1, 8, 3, 4, 5, 6, 7, 8, 9, , 11, 22, 13, 14, 18, 16, 17, 18, 19, 20, 21, 22, 23, , 25, 32, 27, 28, 29, 30, 31, 32, 33, , 35, 36, 58, 39, 39, 58, 42, 42, 57, 44, 45, 46, 57, 48, 56, 54,
 54, 54, 54, 54, 55, 56, 57, 58, 59, 60, 91, 85, 67, 67, 67, 67, 67, 68, 71, 70, 71, 78, 73, 74, 78, 77, 77, 78, 85, 81, 81, 83, 83, 84, 85, 86, 87, 91, 89, 90, 91, 92, , 94, 97, 96, 97, 98, , 100,
 101, 154, 104, 104, 126, 107, 107, 122, 109, 110, 111, 122, 113, 121, 119, 119, 119, 119, 119, 120, 121, 122, 126, 124, 125, 126, 127, 128, 154, 131, 131, 151, 151, 150, 135, 143, 141, 141, 141, 141, 141, 142, 143, 150, 148, 147, 147, 148, 149, 150,
 151, 152, 153, 154, 155, , 'end'];

var FunctionNotes = [92, 155, 98, 33, 29, 9, 5, 23, 19, 'end'];

var CodeTags = [['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], ['end'], ['end'], ['end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], ['end'], ['end'], ['end'],
 ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], [12, 8, 6, 'end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'],
 ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'],
 ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], 'end'];

var SourceCodeNotes = [[92, 'end'], [91, 'end'], [60, 'end'], [35, 'end'], [45, 'end'], [44, 'end'], [90, 'end'], [87, 'end'], [73, 'end'], [155, 'end'], [154, 'end'], [128, 'end'], [124, 'end'], [110, 'end'], [109, 'end'], [101, 'end'], [153, 'end'], [98, 'end'], [97, 'end'], [93, 'end'], [33, 'end'], [32, 'end'], [30, 'end'], [28, 'end'], [27, 'end'], [9, 'end'], [8, 'end'], [6, 'end'], [4, 'end'], [3, 'end'], [23, 'end'], [22, 'end'], [20, 'end'], [18, 'end'], [17, 'end'], [16, 'end'], [14, 'end'], [13, 'end'], 'end'];
var CodeCoverage;
var SourceCoverage;

function init_file () {
  if (top.close_target_frame) {
    var backlink = document.getElementById('backlink');
    backlink.innerHTML = '[Close]<p>';
    backlink.onclick = top.close_target_frame;
  }
  colorize (true);
}

function tags_intersect (tags1, tags2) {   // tags2 = true means all tags.
  var ntags = tags1.length - 1;
  if (tags2 === true)
    return (ntags > 0);
  for (var i = 0; i < ntags; i++) {
    var tag1 = tags1[i];
    for (var j = 0; j < tags2.length; j++)
      if (tag1 == tags2[j]) return true;
  }
  return false;
}

function is_member (elt, vec) {
  for (var i = 0; i < vec.length; i++) {
    if (vec[i] == elt) return true;
  }
  return false;
}

function set_stats_with_pct(name, count, total) {
  var pct;

  if (total > 0) {
    var pct = (count * 100) / total;
    pct = pct.toFixed(1) + '&#37;';
  }
  else {
    pct = '--';
  }
  
  document.getElementById(name).innerHTML = count;

  document.getElementById(name + 'Pct').innerHTML =  pct;
}

function colorize (tags_to_show) {
  var style;

  // Compute acode coverage and colorize acode
  var total = (CodeTags ? CodeTags.length : CodeCoverage.length) - 1;
  var num_entered = 0;
  var coverage = new Array(total);

  for (var cn = 0; cn < total; cn++) {
    var covered = (CodeTags ? tags_intersect(CodeTags[cn], tags_to_show) : CodeCoverage[cn]);
    style = (covered ? ALL_COVERED : NOT_COVERED);

    var sub_style = coverage[cn];
    if (sub_style && (style != sub_style)) style = PARTLY_COVERED;

    coverage[cn] = style; // save for source coloring use below
    if (style != NOT_COVERED) num_entered++;
    var parent = CodeParents[cn];
    if (parent) {
      var sibs_style = coverage[parent];
      if (sibs_style != style) coverage[parent] = (!sibs_style ? style : PARTLY_COVERED);
    }

  var elt = document.getElementById('f0c' + cn);  // some notes don't have a matched up source.
  if (elt) elt.className = 'st' + style;
  }


  document.getElementById('acodeTotal').innerHTML = total;
  set_stats_with_pct('acodeCovered', num_entered, total);

  // Count unreached branches (aka maximal unentered forms)
  var total = coverage.length;
  var num_branches = 0;
  var parent;
  for (var cn = 0; cn < total; cn++) {
    if ((coverage[cn] == NOT_COVERED) && // not covered
        (parent = CodeParents[cn]) &&  // has a parent
        (coverage[parent] != NOT_COVERED) &&  // that's covered
        (!is_member(cn, FunctionNotes))) // and not an entry note
      num_branches++;
  }

  document.getElementById('branchUnreached').innerHTML = num_branches;


  // Colorize Source
  var total = (SourceCodeNotes ? SourceCodeNotes.length : SourceCoverage.length) - 1;
  var num_all = 0, num_partly = 0;

  for (var sn = 0; sn < total; sn++) {
    if (SourceCodeNotes) {
      var notes = SourceCodeNotes[sn];
      for (var i = 0, style = NO_DATA; i < (notes.length - 1); i++) {
        var note_style = coverage[notes[i]];
        if (style != note_style) style = (style == NO_DATA ? note_style : PARTLY_COVERED);
      }
    }
    else {
      style = SourceCoverage[sn];
    }

    switch (style) {
      case ALL_COVERED: num_all++; break;
      case PARTLY_COVERED: num_partly++; break;
    }

   document.getElementById('f0s' + sn).className = 'st' + style;

  }
  document.getElementById('srcTotal').innerHTML = total;
  set_stats_with_pct('srcEntered', num_all + num_partly, total);
  set_stats_with_pct('srcCovered', num_all, total);

  var total = FunctionNotes.length - 1;
  var num_all = 0, num_partly = 0, num_not = 0;

  for (var i = 0; i < total; i++) {
    var cn = FunctionNotes[i];
    switch (coverage[FunctionNotes[i]]) {
      case ALL_COVERED: num_all++; break;
      case PARTLY_COVERED: num_partly++; break;
      case NOT_COVERED: num_not++; break;
    }
  }

  document.getElementById('fnTotal').innerHTML = total;
  set_stats_with_pct('fnCovered', num_all, total);
  set_stats_with_pct('fnPartly', num_partly, total);
  set_stats_with_pct('fnUnentered', num_not, total);


}

function show_tags (sn) {
  tags_frame = top.frames.tagsframe;
  if (tags_frame && tags_frame.select_tags) {
    var tags = new Array();
    var outer_notes = SourceCodeNotes[sn].slice(0);
    var total = CodeTags.length - 1;
    for (cn = total - 1; cn >= 0; cn--) {
      if (is_member(CodeParents[cn], outer_notes)) {
         outer_notes.push(cn);
         var new_tags = CodeTags[cn];
         var n = new_tags.length - 1;
         for (i = 0; i < n; i++) {
           var tag = new_tags[i];
           if (!is_member(tag, tags)) tags.push(tag);
         }
      }
    }
    tags_frame.select_tags(tags);
  }
}


