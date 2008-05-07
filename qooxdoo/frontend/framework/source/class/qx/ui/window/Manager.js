/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/** This singleton manages qx.ui.window.Windows */
qx.Class.define("qx.ui.window.Manager",
{
  extend : qx.util.Set,





  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /** This property holds the current active window */
    activeWindow :
    {
      check : "Object",
      nullable : true,
      apply : "_applyActiveWindow"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyActiveWindow : function(value, old)
    {
      if (old) {
        old.setActive(false);
      }

      if (value) {
        value.setActive(true);
      }

      // TODO 
//      if (old && old.getModal()) {
//        old.getTopLevelWidget().release(old);
//      }

//      if (value && value.getModal()) {
//        value.getTopLevelWidget().block(value);
//      }
    },




    /*
    ---------------------------------------------------------------------------
      MANAGER INTERFACE
    ---------------------------------------------------------------------------
    */

    /**
     * Compares two windows (used as sort method in {@link #remove}).
     * Sorts the windows by checking which of the given windows is active.
     * If none of those two are active the zIndex are subtracted from each
     * other to determine the sort order.
     *
     * @type member
     * @param w1 {qx.ui.window.Window} first window to compare
     * @param w2 {qx.ui.window.Window} second window to compare
     * @return {int | var} 1 for first window active, -1 for second window active
     * and the subtraction of the zIndex if none of the two are active.
     */
    compareWindows : function(w1, w2)
    {
      switch(w1.getWindowManager().getActiveWindow())
      {
        case w1:
          return 1;

        case w2:
          return -1;
      }

      return w1.getZIndex() - w2.getZIndex();
    },


    /**
     * Adds a {@link qx.ui.window.Window} instance to the manager and
     * sets it as active window.
     *
     * @type member
     * @param vWindow {qx.ui.window.Window} window instance to add
     * @return {void}
     */
    add : function(vWindow)
    {
      this.base(arguments, vWindow);

      // this.debug("Add: " + vWindow);
      this.setActiveWindow(vWindow);
    },


    /**
     * Removes a {@link qx.ui.window.Window} instance from the manager.
     * If the current active window is the one which should be removed the
     * existing windows are compared to determine the new active window
     * (using the {@link #compareWindows} method).
     *
     * @type member
     * @param vWindow {qx.ui.window.Window} window instance
     * @return {void}
     */
    remove : function(vWindow)
    {
      this.base(arguments, vWindow);

      // this.debug("Remove: " + vWindow);
      if (this.getActiveWindow() == vWindow)
      {
        var a = [];

        for (var i in this._objects) {
          a.push(this._objects[i]);
        }

        var l = a.length;

        if (l == 0) {
          this.setActiveWindow(null);
        } else if (l == 1) {
          this.setActiveWindow(a[0]);
        }
        else if (l > 1)
        {
          a.sort(this.compareWindows);
          this.setActiveWindow(a[l - 1]);
        }
      }
    }
  }
});
