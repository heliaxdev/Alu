var NO_DATA = 1, NOT_COVERED = 1, ALL_COVERED = 2, PARTLY_COVERED = 3;


var CodeParents = [3, 3, 3, 11, 8, 8, 7, 8, 9, 10, 11, 12, 13, , 15, 28, 17, 28, 25, 25, 25, 25, 23, 25, 25, 26, 27, 28, , 30, 35, 35, 35, 34, 35, 36, 37, 38, 43, 42, 42, 42, 43, 44, 45, , 47, 60, 49, 60,
 57, 57, 57, 57, 57, 56, 57, 58, 59, 60, , 66, 63, 66, 66, 66, 67, 68, 71, 70, 71, , 75, 75, 75, 86, 77, 82, 79, 82, 82, 82, 83, 84, 85, 86, 87, 88, , 'end'];

var FunctionNotes = [45, 37, 60, 88, 84, 28, 13, 9, 71, 'end'];

var CodeTags = [['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], [6, 1, 'end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'],
 [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 5, 4, 1, 'end'], [12, 8, 6, 4, 'end'], [12, 8, 6, 4, 'end'], [12, 8, 6, 4, 'end'], [12, 8, 6, 4, 'end'], [12, 8, 6, 4, 'end'], [12, 8, 6, 4, 'end'], [12, 8, 6, 4, 'end'], [12, 8, 6, 4, 'end'], ['end'], ['end'], [12, 8, 6, 4, 'end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], ['end'], 'end'];

var SourceCodeNotes = [[45, 'end'], [43, 'end'], [36, 'end'], [35, 'end'], [32, 'end'], [60, 'end'], [49, 'end'], [48, 'end'], [47, 'end'], [46, 'end'], [59, 'end'], [58, 'end'], [88, 'end'], [86, 'end'], [83, 'end'], [82, 'end'], [81, 'end'], [28, 'end'], [15, 'end'], [14, 'end'], [17, 'end'], [16, 'end'], [27, 'end'], [26, 'end'], [13, 'end'], [11, 'end'], [8, 'end'], [5, 'end'], [7, 'end'], [71, 'end'], [70, 'end'], [69, 'end'], [68, 'end'], [67, 'end'], 'end'];
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


